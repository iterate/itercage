# itercage
Iterate Cageball enrollment and notifications.

## Running locally

  1. Install [Meteor.js](http://docs.meteor.com/#quickstart). For the lazy,
     run this command: `curl https://install.meteor.com | /bin/sh`.
  
  2. `git clone https://github.com/iterate/itercage.git`
  
  3. `cd itercage`
  
  4. Run `meteor` and browse to localhost:3000.


## Production environment
The [app.iterate.no][] platform is used for production environment.
To push, add a new git remote, and do a normal git push:

    $ git remote add iterate dokku@app.iterate.no:itercage
    $ git push iterate master

Profit.

[app.iterate.no]: https://iterate.atlassian.net/wiki/display/iter/app.iterate.no+-+Heroku+style+deployment

