# Technical Details

This documents gives brief explanation on technical details and decisions made.


## Choosing LESS Over SASS

LESS is chosen over SASS to achieve the goal of no-rebuild in `development`
mode, as it has the ability to be compiled and run in the browser (in `debug`
and `release` builds, LESS gets precompiled into CSS during the build).

If you wish to use SASS instead, feel free to strip out LESS bits from
Gruntfile and add SASS build plugins, wire up watchers and update the
`/client/src/index.hjs` accordingly.


## Bower Use Approach

Bower is used to easily fetch client-side dependencies, and update them later on.

Still, the repository is configured that client-side dependencies get pushed to
the repository, but after being preprocessed with `grunt bower` task, picking up
only dist files into `client/vendor/`. The reason for that is to explicitly present
the organization/structure of the `client/` directory.

If you wish to change that behavior, just adjust `.gitignore` file to your needs.


## Getting Started for Windows Users

If you're a Windows user, please see the content of `./dev` script,
and replicate that for your Windows environment. It mainly boils down
to setting some environment variables (see `./scripts/envvars.sh`) and
running the `npm dev` task (see `./package.json`). Also, to run the Angular
app in _dev_ mode, replicate `scripts/devsymlink.sh` functionality: symlink
or copy `client/src/` and `client/vendor/` directories into `server/public/`
to make source assets available to Express app to serve.
