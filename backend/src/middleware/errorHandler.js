function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor',
    path: req.path,
    method: req.method,
  });
}

function notFound(req, res) {
  res.status(404).json({
    error: `Rota não encontrada: ${req.method} ${req.path}`,
  });
}

module.exports = { errorHandler, notFound };