import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Produtos from './Produtos'
import api from '../../services/api'

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    patch: jest.fn(),
  },
}))

const apiMock = api as jest.Mocked<typeof api>

describe('Testes automatizados - Página Produtos', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    apiMock.get.mockImplementation((url: string) => {
      if (url.includes('/produtos')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              tipo: 'Notebook',
              quantidade: 10,
              valorUnit: 2500,
              valorTotal: 25000,
              unidadeMedida: 'un',
              ativo: true,
              categoria: {
                id: 1,
                nome: 'Eletrônicos',
              },
            },
          ],
        })
      }

      if (url.includes('/categorias')) {
        return Promise.resolve({
          data: [
            {
              id: 1,
              nome: 'Eletrônicos',
            },
          ],
        })
      }

      return Promise.resolve({ data: [] })
    })

    apiMock.post.mockResolvedValue({ data: {} })
    apiMock.put.mockResolvedValue({ data: {} })
    apiMock.patch.mockResolvedValue({ data: {} })
  })

  async function renderizarProdutos() {
    render(<Produtos />)

    await waitFor(() => {
      expect(screen.getByText('Notebook')).toBeInTheDocument()
    })
  }

  test('CT014 - deve renderizar a tela de Produtos e listar produto cadastrado', async () => {
    await renderizarProdutos()

    expect(screen.getByText('Produtos')).toBeInTheDocument()
    expect(screen.getByText('+ Novo Produto')).toBeInTheDocument()
    expect(screen.getByText('Mostrar inativos')).toBeInTheDocument()
    expect(screen.getByText('Notebook')).toBeInTheDocument()
  })

  test('CT014 - deve abrir o formulário de novo produto', async () => {
    await renderizarProdutos()

    fireEvent.click(screen.getByText('+ Novo Produto'))

    expect(screen.getByText('Novo Produto')).toBeInTheDocument()
    expect(screen.getByText('Tipo *')).toBeInTheDocument()
    expect(screen.getByText('Quantidade *')).toBeInTheDocument()
    expect(screen.getByText('Valor Unit. *')).toBeInTheDocument()
    expect(screen.getByText('Valor Total *')).toBeInTheDocument()
    expect(screen.getAllByText('Categoria').length).toBeGreaterThan(0)

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Eletrônicos' })
      ).toBeInTheDocument()
    })
  })

  test('CT014 - deve permitir preencher os campos do produto', async () => {
    await renderizarProdutos()

    fireEvent.click(screen.getByText('+ Novo Produto'))

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Eletrônicos' })
      ).toBeInTheDocument()
    })

    const textInputs = screen.getAllByRole('textbox')
    const numberInputs = screen.getAllByRole('spinbutton')
    const categoriaSelect = screen.getByRole('combobox')

    fireEvent.change(textInputs[0], {
      target: { value: 'Mouse Gamer' },
    })

    fireEvent.change(numberInputs[0], {
      target: { value: '5' },
    })

    fireEvent.change(numberInputs[1], {
      target: { value: '100' },
    })

    fireEvent.change(numberInputs[2], {
      target: { value: '500' },
    })

    fireEvent.change(textInputs[1], {
      target: { value: 'un' },
    })

    fireEvent.change(categoriaSelect, {
      target: { value: '1' },
    })

    expect(textInputs[0]).toHaveValue('Mouse Gamer')
    expect(numberInputs[0]).toHaveValue(5)
    expect(numberInputs[1]).toHaveValue(100)
    expect(numberInputs[2]).toHaveValue(500)
    expect(textInputs[1]).toHaveValue('un')
    expect(categoriaSelect).toHaveValue('1')
  })

  test('CT014 - deve salvar produto válido com sucesso', async () => {
    await renderizarProdutos()

    fireEvent.click(screen.getByText('+ Novo Produto'))

    await waitFor(() => {
      expect(
        screen.getByRole('option', { name: 'Eletrônicos' })
      ).toBeInTheDocument()
    })

    const textInputs = screen.getAllByRole('textbox')
    const numberInputs = screen.getAllByRole('spinbutton')
    const categoriaSelect = screen.getByRole('combobox')

    fireEvent.change(textInputs[0], {
      target: { value: 'Mouse Gamer' },
    })

    fireEvent.change(numberInputs[0], {
      target: { value: '5' },
    })

    fireEvent.change(numberInputs[1], {
      target: { value: '100' },
    })

    fireEvent.change(numberInputs[2], {
      target: { value: '500' },
    })

    fireEvent.change(textInputs[1], {
      target: { value: 'un' },
    })

    fireEvent.change(categoriaSelect, {
      target: { value: '1' },
    })

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(apiMock.post).toHaveBeenCalledWith(
        '/produtos',
        expect.objectContaining({
          tipo: 'Mouse Gamer',
          quantidade: 5,
          valorUnit: 100,
          valorTotal: 500,
          unidadeMedida: 'un',
          categoriaId: 1,
        })
      )
    })
  })

  test('CT015 - deve exibir mensagem de erro ao tentar salvar produto inválido', async () => {
    apiMock.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Tipo e Quantidade são obrigatórios',
        },
      },
    })

    await renderizarProdutos()

    fireEvent.click(screen.getByText('+ Novo Produto'))

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(
        screen.getByText('Tipo e Quantidade são obrigatórios')
      ).toBeInTheDocument()
    })
  })
})