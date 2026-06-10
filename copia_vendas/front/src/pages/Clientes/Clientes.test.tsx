import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Clientes from './Clientes'
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

describe('Testes automatizados - Página Clientes', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    apiMock.get.mockResolvedValue({
      data: [
        {
          id: 1,
          nome: 'Cliente Teste',
          cpfCnpj: '12345678000199',
          responsavel: 'Cristiane',
          telefone: '81999999999',
          email: 'cliente@teste.com',
          ativo: true,
        },
      ],
    })

    apiMock.post.mockResolvedValue({ data: {} })
    apiMock.put.mockResolvedValue({ data: {} })
    apiMock.patch.mockResolvedValue({ data: {} })
  })

  async function renderizarClientes() {
    render(<Clientes />)

    await waitFor(() => {
      expect(screen.getByText('Cliente Teste')).toBeInTheDocument()
    })
  }

  test('CT008 - deve renderizar a tela de Clientes e listar cliente cadastrado', async () => {
    await renderizarClientes()

    expect(screen.getByText('Clientes')).toBeInTheDocument()
    expect(screen.getByText('+ Novo Cliente')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Buscar por nome...')).toBeInTheDocument()
    expect(screen.getByText('Cliente Teste')).toBeInTheDocument()
  })

  test('CT008 - deve abrir o formulário de novo cliente', async () => {
    await renderizarClientes()

    fireEvent.click(screen.getByText('+ Novo Cliente'))

    expect(screen.getByText('Novo Cliente')).toBeInTheDocument()
    expect(screen.getByText('Nome *')).toBeInTheDocument()
    expect(screen.getByText('CPF/CNPJ *')).toBeInTheDocument()
    expect(screen.getByText('Responsável *')).toBeInTheDocument()
    expect(screen.getByText('Salvar')).toBeInTheDocument()
  })

  test('CT008 - deve permitir preencher os campos obrigatórios do cliente', async () => {
    await renderizarClientes()

    fireEvent.click(screen.getByText('+ Novo Cliente'))

    const inputs = screen.getAllByRole('textbox')

    // índice 0 = campo de busca da tela
    // índice 1 = Nome
    // índice 2 = CPF/CNPJ
    // índice 3 = Responsável
    fireEvent.change(inputs[1], {
      target: { value: 'Empresa Cliente LTDA' },
    })

    fireEvent.change(inputs[2], {
      target: { value: '11222333000144' },
    })

    fireEvent.change(inputs[3], {
      target: { value: 'Ana Responsável' },
    })

    expect(inputs[1]).toHaveValue('Empresa Cliente LTDA')
    expect(inputs[2]).toHaveValue('11222333000144')
    expect(inputs[3]).toHaveValue('Ana Responsável')
  })

  test('CT008 - deve salvar cliente válido com sucesso', async () => {
    await renderizarClientes()

    fireEvent.click(screen.getByText('+ Novo Cliente'))

    const inputs = screen.getAllByRole('textbox')

    fireEvent.change(inputs[1], {
      target: { value: 'Empresa Cliente LTDA' },
    })

    fireEvent.change(inputs[2], {
      target: { value: '11222333000144' },
    })

    fireEvent.change(inputs[3], {
      target: { value: 'Ana Responsável' },
    })

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(apiMock.post).toHaveBeenCalledWith(
        '/clientes',
        expect.objectContaining({
          nome: 'Empresa Cliente LTDA',
          cpfCnpj: '11222333000144',
          responsavel: 'Ana Responsável',
        })
      )
    })
  })

  test('CT009 - deve exibir mensagem de erro ao tentar salvar cliente inválido', async () => {
    apiMock.post.mockRejectedValueOnce({
      response: {
        data: {
          detail: 'Nome, CPF/CNPJ e Responsável são obrigatórios',
        },
      },
    })

    await renderizarClientes()

    fireEvent.click(screen.getByText('+ Novo Cliente'))

    fireEvent.click(screen.getByText('Salvar'))

    await waitFor(() => {
      expect(
        screen.getByText('Nome, CPF/CNPJ e Responsável são obrigatórios')
      ).toBeInTheDocument()
    })
  })
})