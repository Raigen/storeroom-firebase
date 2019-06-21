workflow "Firebase hosting" {
  on = "push"
  resolves = ["Deploy hosting to firebase"]
}

action "Install dependencies" {
  uses = "docker://node:10"
  runs = "yarn"
}

action "Run tests" {
  uses = "docker://node:10"
  needs = ["Install dependencies"]
  args = "test"
  runs = "yarn"
  env = {
    CI = "true"
  }
}

action "Build hosting" {
  uses = "docker://node:10"
  needs = ["Run tests"]
  args = "build"
  runs = "yarn"
  secrets = ["REACT_APP_API_KEY", "REACT_APP_AUTH_DOMAIN", "REACT_APP_DATABASE_URL", "REACT_APP_PROJECT_ID", "REACT_APP_STORAGE_BUCKET", "REACT_APP_MESSAGING_SENDER_ID"]
}

action "Deploy only on master" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = ["Build hosting"]
  args = "branch master"
}

action "Deploy hosting to firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Deploy only on master"]
  args = "deploy --only hosting"
  secrets = ["FIREBASE_TOKEN"]
}
