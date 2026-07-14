function jsonOk(data) {
  return { ok: true, data };
}

function jsonError(message) {
  return { ok: false, error: message };
}

export function profileHandler(user) {
  if (!user) {
    return { ok: false, error: "unauthorized" };
  }

  return { id: user.id, name: user.name };
}
