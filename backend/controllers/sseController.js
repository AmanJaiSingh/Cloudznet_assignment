let clients = [];

exports.subscribe = (req, res) => {
  // Set headers for SSE
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Send an initial heartbeat to establish the connection
  res.write("data: {\"type\": \"connected\"}\n\n");

  // Keep track of the client
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res,
    user: req.user // Use req.user if authentication is required for SSE (so we can filter by team_id)
  };
  
  clients.push(newClient);
  
  // Handle client disconnect
  req.on("close", () => {
    clients = clients.filter((client) => client.id !== clientId);
  });
};

exports.broadcast = (teamId, eventType, payload) => {
  // We only broadcast to clients in the same team
  const relevantClients = clients.filter((client) => client.user.team_id.toString() === teamId.toString());
  
  relevantClients.forEach((client) => {
    client.res.write(`data: ${JSON.stringify({ type: eventType, payload })}\n\n`);
  });
};
