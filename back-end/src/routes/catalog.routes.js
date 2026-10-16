import { Router } from 'express'
import { fixtures } from '../fixtures/index.js'
import { mapearProdutosParaApi } from '../mappers/product.mapper.js'
import { responderErro, responderSucesso } from '../utils/api-response.js'

const router = Router()
const TAMANHO_PAGINA_PADRAO = 20
const TAMANHO_PAGINA_MAXIMO = 100

function erroValidacao(response, campo, message) {
  return responderErro(response, {
    status: 400,
    code: 'VALIDATION_ERROR',
    message: 'Um ou mais parâmetros são inválidos.',
    details: [{ field: campo, message }],
  })
}

function lerInteiroPositivo(value, fallback, campo, response, maximo = Number.MAX_SAFE_INTEGER) {
  if (value === undefined) return fallback
  if (!/^[1-9]\d*$/.test(value)) {
    erroValidacao(response, campo, 'Informe um número inteiro maior que zero.')
    return null
  }

  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed > maximo) {
    erroValidacao(response, campo, `O valor máximo permitido é ${maximo}.`)
    return null
  }

  return parsed
}

function lerBooleano(value, fallback, campo, response) {
  if (value === undefined) return fallback
  if (value === 'true') return true
  if (value === 'false') return false

  erroValidacao(response, campo, 'Informe true ou false.')
  return null
}

function produtosDisponiveis() {
  return mapearProdutosParaApi(fixtures.products)
}

router.get('/categories', (request, response) => {
  return responderSucesso(response, fixtures.categories.map((category) => ({ ...category })))
})

router.get('/products', (request, response) => {
  const { category, search, sort: requestedSort } = request.query
  const sort = requestedSort || 'expiresAt'
  if (category !== undefined && (typeof category !== 'string' || category.length > 100)) {
    return erroValidacao(response, 'category', 'A categoria deve ter até 100 caracteres.')
  }
  if (search !== undefined && (typeof search !== 'string' || search.length > 100)) {
    return erroValidacao(response, 'search', 'A busca deve ter até 100 caracteres.')
  }
  if (!['expiresAt', 'discount'].includes(sort)) {
    return erroValidacao(response, 'sort', 'Os valores aceitos são expiresAt e discount.')
  }

  const onlyAvailable = lerBooleano(request.query.onlyAvailable, true, 'onlyAvailable', response)
  if (onlyAvailable === null) return

  const page = lerInteiroPositivo(request.query.page, 1, 'page', response)
  if (page === null) return
  const pageSize = lerInteiroPositivo(
    request.query.pageSize,
    TAMANHO_PAGINA_PADRAO,
    'pageSize',
    response,
    TAMANHO_PAGINA_MAXIMO,
  )
  if (pageSize === null) return

  let products = produtosDisponiveis()
  if (category) products = products.filter((product) => product.category === category)
  if (search) {
    const term = search.trim().toLocaleLowerCase('pt-BR')
    products = products.filter((product) =>
      `${product.name} ${product.brand || ''}`.toLocaleLowerCase('pt-BR').includes(term))
  }
  if (onlyAvailable) products = products.filter((product) => product.stock > 0)
  if (sort === 'expiresAt') products.sort((a, b) => a.expiresAt.localeCompare(b.expiresAt))
  if (sort === 'discount') products.sort((a, b) => b.discount - a.discount)

  const total = products.length
  const offset = (page - 1) * pageSize
  const data = products.slice(offset, offset + pageSize)

  return responderSucesso(response, data, {
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    },
  })
})

router.get('/products/:id', (request, response) => {
  if (!/^[1-9]\d*$/.test(request.params.id)) {
    return erroValidacao(response, 'id', 'O identificador deve ser um número inteiro maior que zero.')
  }

  const product = produtosDisponiveis().find((item) => item.id === Number(request.params.id))
  if (!product) {
    return responderErro(response, {
      status: 404,
      code: 'PRODUCT_NOT_FOUND',
      message: 'Produto não encontrado ou indisponível no catálogo público.',
    })
  }

  return responderSucesso(response, product)
})

export default router
