const axios = require("axios");

exports.fetchRelatorio = async (req, res) => {
  const now = new Date();

  // Define o primeiro e o último dia do mês atual
  const primeiroDiaMes = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0]; // Formato yyyy-MM-dd
  const ultimoDiaMes = new Date(now.getFullYear(), now.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0]; // Formato yyyy-MM-dd

  // Pega os valores das query params ou usa os valores calculados
  const vendedor = req.query.vendedor; // Pega do query ou usa 17 como padrão
  const inicio = req.query.inicio || primeiroDiaMes; // Data de início (calculada ou fornecida)
  const final = req.query.final || ultimoDiaMes; // Data de fim (calculada ou fornecida)
  const url = "https://api.rainhadassete.com/api/relatorios/";

  try {
    // Fazendo a requisição GET
    const response = await axios.get(url, {
      params: {
        vendedor,
        inicio,
        final,
      },
    });

    // Envia os dados retornados pela API como resposta
    return res.status(200).json(response.data);
  } catch (error) {
    console.error("Erro ao buscar os relatórios:", error.message);

    // Trata erros e envia resposta com status 500
    return res.status(500).json({
      status: "error",
      message: "Erro ao buscar os relatórios.",
      details: error.response ? error.response.data : error.message,
    });
  }
};
