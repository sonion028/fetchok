import { getType } from "./util";

const TMP_Buffer_U16 = new Uint16Array(32);


/**
 * @Author: sonion
 * @msg: 判断是否是二进制
 * @param {string} buffer - 原始数据
 * @return {boolean}
 */
const isBuffer = (buffer)=>['ArrayBuffer', 'Uint8Array', 'SharedArrayBuffer', 'Buffer'].includes(getType(buffer))



/** @constructor */
export class MyTextDecoder {
	decode(inputArrayOrBuffer){
		// 确保拿到的是ArrayBuffer实例
		const buffer = (inputArrayOrBuffer && inputArrayOrBuffer.buffer) || inputArrayOrBuffer;
		if (inputArrayOrBuffer && !isBuffer(buffer)){
			throw TypeError("Failed to execute 'decode' on 'TextDecoder': The provided value is not of type '(ArrayBuffer or ArrayBufferView)'");
		}
		const nativeBufferHasArrayBuffer = typeof Buffer === 'undefined' || (!!Uint8Array && Uint8Array.prototype.isPrototypeOf(Buffer.prototype));
		var inputAs8 = nativeBufferHasArrayBuffer ? new Uint8Array(buffer) : buffer || [];
		
		var resultingString="", tmpStr="", index=0, len=inputAs8.length|0, lenMinus32=len-32|0, nextEnd=0, cp0=0, codePoint=0, minBits=0, cp1=0, pos=0, tmp=-1;
		// Note that tmp represents the 2nd half of a surrogate pair incase a surrogate gets divided between blocks
		for (; index < len; ) {
			nextEnd = index <= lenMinus32 ? 32 : len - index|0;
			for (; pos < nextEnd; index=index+1|0, pos=pos+1|0) {
				cp0 = inputAs8[index] & 0xff;
				switch(cp0 >> 4) {
					case 15:
						cp1 = inputAs8[index=index+1|0] & 0xff;
						if ((cp1 >> 6) !== 0b10 || 0b11110111 < cp0) {
							index = index - 1|0;
							break;
						}
						codePoint = ((cp0 & 0b111) << 6) | (cp1 & 0b00111111);
						minBits = 5; // 20 ensures it never passes -> all invalid replacements
						cp0 = 0x100; //  keep track of th bit size
					case 14:
						cp1 = inputAs8[index=index+1|0] & 0xff;
						codePoint <<= 6;
						codePoint |= ((cp0 & 0b1111) << 6) | (cp1 & 0b00111111);
						minBits = (cp1 >> 6) === 0b10 ? minBits + 4|0 : 24; // 24 ensures it never passes -> all invalid replacements
						cp0 = (cp0 + 0x100) & 0x300; // keep track of th bit size
					case 13:
					case 12:
						cp1 = inputAs8[index=index+1|0] & 0xff;
						codePoint <<= 6;
						codePoint |= ((cp0 & 0b11111) << 6) | cp1 & 0b00111111;
						minBits = minBits + 7|0;
						
						// Now, process the code point
						if (index < len && (cp1 >> 6) === 0b10 && (codePoint >> minBits) && codePoint < 0x110000) {
							cp0 = codePoint;
							codePoint = codePoint - 0x10000|0;
							if (0 <= codePoint/*0xffff < codePoint*/) { // BMP code point
								//nextEnd = nextEnd - 1|0;
								
								tmp = (codePoint >> 10) + 0xD800|0;   // highSurrogate
								cp0 = (codePoint & 0x3ff) + 0xDC00|0; // lowSurrogate (will be inserted later in the switch-statement)
								
								if (pos < 31) { // notice 31 instead of 32
									TMP_Buffer_U16[pos] = tmp;
									pos = pos + 1|0;
									tmp = -1;
								}  else {// else, we are at the end of the inputAs8 and let tmp0 be filled in later on
									// NOTE that cp1 is being used as a temporary variable for the swapping of tmp with cp0
									cp1 = tmp;
									tmp = cp0;
									cp0 = cp1;
								}
							} else nextEnd = nextEnd + 1|0; // because we are advancing i without advancing pos
						} else {
							// invalid code point means replacing the whole thing with null replacement characters
							cp0 >>= 8;
							index = index - cp0 - 1|0; // reset index  back to what it was before
							cp0 = 0xfffd;
						}
						
						
						// Finally, reset the variables for the next go-around
						minBits = 0;
						codePoint = 0;
						nextEnd = index <= lenMinus32 ? 32 : len - index|0;
					default:
						TMP_Buffer_U16[pos] = cp0; // fill with invalid replacement character
						continue;
					case 11:
					case 10:
					case 9:
					case 8:
				}
				TMP_Buffer_U16[pos] = 0xfffd; // fill with invalid replacement character
			}
			tmpStr += String.fromCharCode(
				TMP_Buffer_U16[ 0], TMP_Buffer_U16[ 1], TMP_Buffer_U16[ 2], TMP_Buffer_U16[ 3], TMP_Buffer_U16[ 4], TMP_Buffer_U16[ 5], TMP_Buffer_U16[ 6], TMP_Buffer_U16[ 7],
				TMP_Buffer_U16[ 8], TMP_Buffer_U16[ 9], TMP_Buffer_U16[10], TMP_Buffer_U16[11], TMP_Buffer_U16[12], TMP_Buffer_U16[13], TMP_Buffer_U16[14], TMP_Buffer_U16[15],
				TMP_Buffer_U16[16], TMP_Buffer_U16[17], TMP_Buffer_U16[18], TMP_Buffer_U16[19], TMP_Buffer_U16[20], TMP_Buffer_U16[21], TMP_Buffer_U16[22], TMP_Buffer_U16[23],
				TMP_Buffer_U16[24], TMP_Buffer_U16[25], TMP_Buffer_U16[26], TMP_Buffer_U16[27], TMP_Buffer_U16[28], TMP_Buffer_U16[29], TMP_Buffer_U16[30], TMP_Buffer_U16[31]
			);
			if (pos < 32) tmpStr = tmpStr.slice(0, pos-32|0);//-(32-pos));
			if (index < len) {
				// String.fromCharCode.apply(0, TMP_Buffer_U16 : NativeUint8Array ?  TMP_Buffer_U16.subarray(0,pos) : TMP_Buffer_U16.slice(0,pos));
				TMP_Buffer_U16[0] = tmp;
				pos = (~tmp) >>> 31;//tmp !== -1 ? 1 : 0;
				tmp = -1;
				
				if (tmpStr.length < resultingString.length) continue;
			} else if (tmp !== -1) {
				tmpStr += String.fromCharCode(tmp);
			}
			
			resultingString += tmpStr;
			tmpStr = "";
		}
		return resultingString;
	}
}
