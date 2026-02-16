module.exports = {
  apps: [{
    name: 'sss-website',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3380',
    cwd: '/home/xiko/sss/packages/web',
    env: {
      NODE_ENV: 'production',
      PORT: 3380,
    },
  }],
};
