describe('MeanBpApp', function() {

  it('is defined', function() {
    expect(MeanBpApp).to.be.an('object');
  });

  it('returns the ng module named "meanbpapp.app" on start()', function() {
    var module = MeanBpApp.start();
    expect(module).to.be.an('object');
    expect(module.name).to.equal('meanbpapp.app');
  });
});
