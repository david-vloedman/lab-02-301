'using strict';

function Img(img){
  this.img_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
}

Img.allImgs = [];



Img.prototype.render = function(){
  // let imgClone = $('#photo-template').clone();
  // let $imgClone = $(imgClone[0]);
  
  // $imgClone.find('img').attr('src', this.img_url);
  
  // $imgClone.removeClass('clone');
  // $imgClone.attr('class', this.keyword);
  // $imgClone.attr('id', this.keyword);
  // $imgClone.appendTo('.flex-container');
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);

};

Img.readJSON = source => {
  $.get(source)
    .then(data => {
      data.forEach(img => {
        Img.allImgs.push(new Img(img));
      });
    })
    .then(Img.loadImgs)
    .then(Img.populateKeyword);
};

Img.loadImgs = () => {
  Img.allImgs.forEach(img => $('.flex-container').append(img.render()));
};

Img.populateKeyword = () => {
  Img.allImgs.forEach(img => {
    let $option = Img.createOption(img);
    $option.appendTo('select');
  });
};

Img.createOption = img => {
  let $option = $('<option></option>');
  $option.attr('value', img.keyword);
  $option.text(img.keyword);
  return $option;
};

Img.hideImages = () => {
  $('section').hide();
};

Img.handleSelect = () => {
  Img.hideImages();
  let selection = $('select').val();
  $(`.${selection}`).show();
};

$(() => {
  Img.readJSON('data/page-1.json');
  $('select').change(Img.handleSelect);

});







