import { Router } from 'express'
import { responderSucesso } from '../utils/api-response.js'

const router = Router()

export function healthHandler(request, response) {
  return responderSucesso(response, {
    status: 'ok',
    service: 'food-promotion-api',
    version: 'v1',
  })
}

router.get('/health', healthHandler)

export default router
