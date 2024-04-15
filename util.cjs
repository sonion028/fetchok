
/**
 * @Author: sonion
 * @msg: 获取元素的数据类型
 * @param {any} data
 * @return {String}
 */
const getType = (data)=> Object.prototype.toString.call(data).replace(/^\[[a-z]+ ([A-Za-z]+)\]$/, '$1');


/**
 * @Author: sonion
 * @msg: 解决了循环引用、原型一致的深度克隆 // 原生structuredClone 没解决Symbol、原型链，兼容到22年8月
 * @param {Object|Array} value 要克隆的对象
 * @param {Boolean} [isCopyProto] 是否拷贝原型链 -默认值：true
 * @return {Object|Array}
 */
const deepClone = (value, isCopyProto = true)=>{
  const cache = new WeakMap(); // 解决循环引用 weakMap不影响垃圾回收
  const _deepClone = (value)=>{
    if (value === null || typeof value !== 'object') return value;
    switch(getType(value)){
      case 'Date':
        return new Date(value.valueOf());
      case 'RegExp':
        return new RegExp(value.valueOf());
      case 'WeakMap':
        return value;
      case 'WeakSet':
        return value;
    }

    if (cache.get(value)) return cache.get(value); // 解决循环引用
    const result = Array.isArray(value) ? [] : getType(value) === 'Set' ? new Set() : getType(value) === 'Map' ? new Map() : {};
    isCopyProto && Object.setPrototypeOf(result, Object.getPrototypeOf(value)); // 拷贝原型链
    cache.set(value, result); // 解决循环引用 把克隆过的保存。因为是递归，必须提前报存。否则后面的循环引用可能获取不到，一直进入下一层

    if (getType(value) === 'Set') {
      for (const v of value){
        result.add(_deepClone(v))
      }
    }else if (getType(value) === 'Map') {
      for (const [k, v] of value){
        result.set(_deepClone(k), _deepClone(v)) // Map key可以是对象，所以也要深拷贝
      }
    }else Reflect.ownKeys(value).map(key=>result[key] = _deepClone(value[key]))
    return result;
  }
  return _deepClone(value);
}

// ===============>nodejs<==============
const fs = require("node:fs");
const path = require("node:path");
/**
 * @Author: sonion
 * @msg: node 删除目录
 * @return {*}
 */
const deleteFolder = (folder)=>{
  if (fs.existsSync(folder)){
    fs.rmSync(folder, { recursive: true }) // 有文件也删除
  }
}

/**
 * @Author: sonion
 * @msg: node文件拷贝
 * @return {*}
 */
const copyFile = (sourceFile, targetFile)=>{
  const targetPath = path.dirname(targetFile)
  if (!fs.existsSync(targetPath)){
    fs.mkdirSync(targetPath)
  }
  fs.copyFileSync(sourceFile, targetFile);
}


module.exports = {
  deepClone,
  deleteFolder,
  copyFile
}



