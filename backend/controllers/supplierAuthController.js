// File: NekoShop/NekoShop/backend/controllers/supplierAuthController.js

const axios = require('axios');
const { appKey, appSecret, redirectUriBase } = require('../../../config/aliExpressAuth');

// 1) Redirige al usuario a AliExpress para autorizar la app
exports.redirectToAliExpress = (req, res) => {
  console.log('🐛 Llego a redirectToAliExpress', { params: req.params });

  const { supplierId } = req.params;
  const redirectUri    = `${redirectUriBase}/${supplierId}/auth/callback`;
  const state          = supplierId;

  const authUrl =
    'https://oauth.aliexpress.com/authorize' +
    `?response_type=code` +
    `&app_key=${encodeURIComponent(appKey)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  console.log('🔗 OAuth URL:', authUrl);
  return res.redirect(authUrl);
};

// 2) Gestiona el callback y obtiene los tokens
exports.handleCallback = async (req, res) => {
  console.log('🐛 Llego a handleCallback', { query: req.query });

  const { code, state } = req.query;
  const supplierId      = state;

  if (!code) {
    return res.status(400).send('❌ Falta código de autorización');
  }

  try {
    const { data } = await axios.post(
      'https://oauth.aliexpress.com/token',
      null,
      {
        params: {
          grant_type:   'authorization_code',
          app_key:      appKey,
          client_secret: appSecret,
          code,
          redirect_uri: `${redirectUriBase}/${supplierId}/auth/callback`
        }
      }
    );

    const { access_token, refresh_token, expires_in } = data;

    // Aquí guarda en tu BD SQLite los tokens para supplierId.
    // Ejemplo:
    // const sqlite3 = require('sqlite3').verbose();
    // const dbPath = path.join(__dirname, '..', 'data', 'products.db');
    // const db = new sqlite3.Database(dbPath);
    // db.run(
    //   `UPDATE suppliers SET config = json_set(config,
    //       '$.accessToken', ?, '$.refreshToken', ?, '$.expiresIn', ?) WHERE id = ?`,
    //   [access_token, refresh_token, expires_in, supplierId]
    // );

    return res.json({
      message:      '✅ Autenticación completada',
      supplierId,
      access_token,
      refresh_token,
      expires_in
    });
  } catch (err) {
    console.error('Error obteniendo token:', err.response?.data || err.message);
    return res.status(500).send('❌ Error interno capturando token');
  }
};
