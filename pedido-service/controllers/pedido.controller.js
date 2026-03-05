import Pedido from '../models/Pedido.js';
import fetch from 'node-fetch';

// Função nova pra validar produtos
async function validarProdutos(produtoIds) {
  if (!produtoIds || produtoIds.length === 0) {
    throw new Error('Pelo menos um produto é obrigatório');
  }
  for (let id of produtoIds) {
    const response = await fetch(`${process.env.PRODUTO_SERVICE_URL}/${id}`);
    if (!response.ok) {
      throw new Error(`Produto com ID ${id} não existe`);
    }
  }
}

// Função auxiliar para validar cliente
const validarCliente = async (clienteId) => {
    const url = `${process.env.CLIENTE_SERVICE_URL}/${clienteId}`;
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error('Cliente não encontrado');
    }
    return res.json();
};

// Criar pedido
export const createPedido = async (req, res) => {
  try {
    const { descricao, valor, clienteId, produtoIds } = req.body;

    // Valida cliente (já deve ter isso)
    const clienteResponse = await fetch(`${process.env.CLIENTE_SERVICE_URL}/${clienteId}`);
    if (!clienteResponse.ok) {
      return res.status(400).json({ error: 'Cliente inválido' });
    }

    // Valida produtos (novo)
    await validarProdutos(produtoIds);

    const pedido = await Pedido.create({ descricao, valor, clienteId, produtoIds });
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Listar todos os pedidos
export const getPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.findAll();
        res.json(pedidos);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Buscar um pedido por ID
export const getPedidoById = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        res.json(pedido);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Atualizar um pedido
export const updatePedido = async (req, res) => {
  try {
    const pedido = await Pedido.findByPk(req.params.id);
    if (!pedido) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    const { descricao, valor, clienteId, produtoIds } = req.body;

    // Valida cliente se alterado
    if (clienteId && clienteId !== pedido.clienteId) {
      const clienteResponse = await fetch(`${process.env.CLIENTE_SERVICE_URL}/${clienteId}`);
      if (!clienteResponse.ok) {
        return res.status(400).json({ error: 'Cliente inválido' });
      }
    }

    // Valida produtos se alterados
    if (produtoIds) {
      await validarProdutos(produtoIds);
    }

    await pedido.update(req.body);
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar um pedido
export const deletePedido = async (req, res) => {
    try {
        const pedido = await Pedido.findByPk(req.params.id);
        if (!pedido) {
            return res.status(404).json({ error: 'Pedido não encontrado' });
        }
        await pedido.destroy();
        res.json({ message: 'Pedido deletado com sucesso' });
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
};