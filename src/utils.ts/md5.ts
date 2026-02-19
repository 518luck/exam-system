//引入 Node.js 内置的加密模块 crypto。它提供了各种加密算法（如 MD5, SHA-1, SHA-256 等）。
import * as crypto from 'crypto';

export function md5(str: string) {
  //创建一个 MD5 散列算法的实例。
  const hash = crypto.createHash('md5');
  //把你要加密的字符串（比如用户的原始密码 "123456"）喂给这个算法
  hash.update(str);
  //计算最终的散列值（也就是“摘要”） 'hex': 以十六进制字符串的形式输出结果
  return hash.digest('hex');
}
