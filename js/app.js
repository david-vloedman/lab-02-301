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
  console.log(imgClone);
  let $imgClone = $(imgClone[0]);
  console.log($imgClone);

  $imgClone.find('h2').text(this.title);
  $imgClone.find('img').attr('src', this.img_url);
  $imgClone.find('p').text(this.description);
  $imgClone.removeClass('clone');
  $imgClone.attr('class', this.keyword);

  $imgClone.appendTo('main');

};

Img.readJSON = () => {
  $.get('data/page-1.json')
    .then(data => {
      data.forEach(img => {
        Img.allImgs.push(new Img(img));
      });
    })
    .then(Img.loadImgs);

};

Img.loadImgs = () => {
  Img.allImgs.forEach(img => img.render());
};



$(() => Img.readJSON());





