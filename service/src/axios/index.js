import { fetch } from './fetch'

export function httpRequest (url, method = 'GET', params = '', data = '', contentType = 'application/json; charset=utf-8') {
  return fetch({
    url,
    method,
    params,
    data,
    contentType
  })
}
