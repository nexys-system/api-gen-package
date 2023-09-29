import * as U from './utils';
import * as T from './type';

test('get subdomain', () => {
  expect(U.getSubdomain(T.Env.dev)).toEqual('dev');
});
