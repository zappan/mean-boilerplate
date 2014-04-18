MEAN Boilerplate
================

MEAN stack boilerplate with build procedures in place.


## Prerequisites

Boilerplate expects that you have the necessary platforms and tools installed
(Git, Node.js, MongoDB). It also expect some global npm modules to be present
on the system, so if you don't have them already, install the following:

    $ sudo npm install -g grunt-cli bower


## Getting Started

After picking up the boilerplate as a base for your new project,
run the following to pull all dependencies:

    $ npm install
    $ bower install

Now that you have dependencies installed, you may run your first
build and do the project test-run (Linux and Mac):

    $ grunt
    $ ./dev

_If you're a Windows user, please see the content of `./dev` script,
and replicate that for your Windows environment. It mainly boils down
to setting some environment variables (see `./scripts/envvars.sh`) and
running the `npm dev` task (see `./package.json`)._

If everything went well, you should have boilerplate project listening
on port 3000 serving your Angular app.


## History

  * **0.1.0** - [2014-04-18] Initial release


## License

This library is licensed under the **MIT License**
