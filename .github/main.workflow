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
  needs = [ "Install dependencies" ]
  args = "test"
  runs = "yarn"
}

action "Build hosting" {
  uses = "docker://node:10"
  needs = [ "Run tests" ]
  args = "build"
  runs = "yarn"
}
action "Deploy only on master" {
  uses = "actions/bin/filter@3c0b4f0e63ea54ea5df2914b4fabf383368cd0da"
  needs = [ "Build hosting" ]
  args = "branch master"
}


action "Deploy hosting to firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = [ "Deploy only on master" ]
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only hosting"
}
