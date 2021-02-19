/**
 * ipv4
 */
export const regExpIPV4 = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;

/**
 * ipv6
 */
export const regExpIPV6 = /^([\da-fA-F]{1,4}:){6}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^::([\da-fA-F]{1,4}:){0,4}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:):([\da-fA-F]{1,4}:){0,3}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){2}:([\da-fA-F]{1,4}:){0,2}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){3}:([\da-fA-F]{1,4}:){0,1}((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){4}:((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$|^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$|^:((:[\da-fA-F]{1,4}){1,6}|:)$|^[\da-fA-F]{1,4}:((:[\da-fA-F]{1,4}){1,5}|:)$|^([\da-fA-F]{1,4}:){2}((:[\da-fA-F]{1,4}){1,4}|:)$|^([\da-fA-F]{1,4}:){3}((:[\da-fA-F]{1,4}){1,3}|:)$|^([\da-fA-F]{1,4}:){4}((:[\da-fA-F]{1,4}){1,2}|:)$|^([\da-fA-F]{1,4}:){5}:([\da-fA-F]{1,4})?$|^([\da-fA-F]{1,4}:){6}:$/;

/**
 * validation ip address
 *
 * @param ip `string` ipv4 or ipv6
 */

export const validationIp = (ip: string): boolean => {
  if (!ip) return false;

  const isIPV4 = regExpIPV4.test(ip);
  const isIPV6 = regExpIPV6.test(ip);
  return !!isIPV4 || !!isIPV6;
};

/**
 * Get ip from request
 *
 * @param requset `Request`
 */
export const getIpByRequest = (requset: any): string => {
  let ip = '';
  if (!requset) return ip;
  const { headers, socket, connection } = requset;

  if (headers && headers['x-real-ip']) ip = headers['x-real-ip'] as string;
  else if (headers && headers['ali-cdn-real-ip']) ip = headers['ali-cdn-real-ip'] as string;
  else if (headers && headers['x-forwarded-for']) ip = headers['x-forwarded-for'] as string;
  else if (connection && connection.remoteAddress) ip = connection.remoteAddress as string;
  else if (socket && socket.remoteAddress) ip = socket.remoteAddress as string;
  else if (requset.ip) ip = requset.ip;

  if (ip && ip.substr(0, 7) === '::ffff:') ip = ip.substr(7);
  return validationIp(ip) ? ip : '';
};
