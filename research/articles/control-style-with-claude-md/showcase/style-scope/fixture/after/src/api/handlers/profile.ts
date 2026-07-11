function jsonOk(data) {
  return { ok: true, data };
}

function jsonError(message) {
  return { ok: false, error: message };
}

export function profileHandler(user) {
  if (!user) {
    return jsonError("unauthorized");
  }

  return jsonOk({ id: user.id, name: user.name });
}
