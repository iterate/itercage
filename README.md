# itercage
Iterate Cageball enrollment and notifications.

## Running locally

  1. Check if your platform is
     [supported](https://github.com/meteor/meteor/wiki/Supported-Platforms).
  
  2. Install [Meteor.js](http://docs.meteor.com/#quickstart), or for the lazy,
     run this command: `curl https://install.meteor.com | /bin/sh`.
     Verify by running `meteor --version`.
  
  3. `git clone https://github.com/iterate/itercage.git`
  
  4. `cd itercage`
  
  5. Run `meteor` and browse to localhost:3000.


## Production environment
The [app.iterate.no][] platform is used for production environment.
To push, add a new git remote, and do a normal git push:

    $ git remote add iterate dokku@app.iterate.no:itercage
    $ git push iterate master

Profit.

[app.iterate.no]: https://iterate.atlassian.net/wiki/display/iter/app.iterate.no+-+Heroku+style+deployment

