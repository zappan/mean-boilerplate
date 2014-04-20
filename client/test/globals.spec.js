before(function() {
  MeanBpApp.start();
});


describe('modules definitions', function() {

  it('should have "meanbpapp.app" module defined', function() {
    expect(angular.module('meanbpapp.app')).to.be.an('object');
  });

  it('should have "meanbpapp.home" module defined', function() {
    expect(angular.module('meanbpapp.home')).to.be.an('object');
  });
});
