export const sampleRouterJson = `{
  "web1.local.gluestack.app": [
    {
      "path": "/web/api",
      "proxy": {
        "instance": "web1",
        "path": "/api"
      }
    },
    {
      "path": "/web/graphql",
      "proxy": {
        "instance": "graphql1",
        "path": "/v1/graphql"
      }
    },
    {
      "path": "/",
      "proxy": {
        "instance": "web1",
        "path": "/"
      }
    }
  ],
  "web2.local.gluestack.app": [
    {
      "path": "/",
      "proxy": {
        "instance": "web2",
        "path": "/"
      }
    },
    {
      "path": "/auth/signin",
      "proxy": {
        "instance": "auth1",
        "path": "/auth/signin"
      }
    }
  ]
}`;
