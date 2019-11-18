({ http_event }) => {
  console.log(http_event);
  console.log(http_event.parsed_body.payload);
  console.log(JSON.parse(http_event.parsed_body.payload));
  return {
    status_code: 200,
    headers: { "Content-Type": "application/json" },
    body: { "greeting": "Hello World" }
  };
}
