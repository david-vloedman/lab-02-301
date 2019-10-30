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
  let imgClone = $('#photo-template').clone();
  let $imgClone = $(imgClone[0]);
  $imgClone.find('h2').text(this.title);
  $imgClone.find('img').attr('src', this.img_url);
  $imgClone.find('p').text(this.description);
  $imgClone.removeClass('clone');
  $imgClone.attr('class', this.keyword);
  console.log($imgClone); 
  $imgClone.appendTo('main');
};

Img.readJSON = () => {
  $.get('data/page-1.json')
    .then(data => {
      data.forEach(img => {
        Img.allImgs.push(new Img(img));
      });
    })
    .then(Img.loadImgs)
    .then(Img.populateKeyword);

};

Img.loadImgs = () => Img.allImgs.forEach(img => img.render());


Img.populateKeyword = () => {
  Img.allImgs.forEach(img => {
    let $option = Img.createOption(img);
    
    $option.appendTo('select');
  });
};

Img.createOption = img => {
  let $option = $('<option></option>');
  console.log($option);
  $option.attr('value', img.keyword);
  $option.text(img.keyword);
  return $option;
};

$(() => {
  Img.readJSON();

});





