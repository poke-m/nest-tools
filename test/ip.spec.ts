import { expect, test } from '@jest/globals';

import { validationIp, getIpByRequest } from '../src';

test('validationIp', async () => {
  expect(validationIp('')).toBe(false);
  expect(validationIp('2001:3CA1:010F:001A:121B:0000:0000:0010')).toBe(true);
});

test('getIpByRequest', async () => {
  expect(getIpByRequest({
    headers: { 'x-real-ip': '101.201.253.122' },
  })).toBe('101.201.253.122');

  expect(getIpByRequest({
    headers: { 'ip': '' },
  })).toBe('');

  expect(getIpByRequest({
    ip: '::ffff:',
  })).toBe('');

  expect(getIpByRequest(null)).toBe('');

  expect(getIpByRequest({
    'ip': '2001:3CA1:010F:001A:121B:0000:0000:0010',
  })).toBe('2001:3CA1:010F:001A:121B:0000:0000:0010');

  expect(getIpByRequest({
    headers: { 'x-forwarded-for': '101.201.253.122' },
  })).toBe('101.201.253.122');

  expect(getIpByRequest({
    connection: { remoteAddress: '101.201.253.122' },
  })).toBe('101.201.253.122');

  expect(getIpByRequest({
    socket: { remoteAddress: '101.201.253.122' },
  })).toBe('101.201.253.122');

  expect(getIpByRequest({
    headers: { 'ali-cdn-real-ip': '101.201.253.122' },
  })).toBe('101.201.253.122');
});
