'using strict';

function Img(img, page){
  this.img_url = img.image_url;
  this.title = img.title;
  this.description = img.description;
  this.keyword = img.keyword;
  this.horns = img.horns;
  this.page = page;
}

Img.allImgs = [];


Img.prototype.render = function(){
  let template = $('#photo-template').html();
  let templateRender = Handlebars.compile(template);
  return templateRender(this);
};

Img.readJSON = (source, page) => {
  $.get(source)
    .then(data => {
      data.forEach(img => {
        Img.allImgs.push(new Img(img, page));
      });
    })
    .then(() => Img.loadImgs(page))
    .then(() => Img.populateKeyword(page));
};

Img.loadImgs = page => {
  Img.allImgs.forEach(img => {
    if(img.page === page) $('.flex-container').append(img.render());
  });
};

  

Img.populateKeyword = page => {
  
  
  Img.allImgs.forEach(img => {
    if(img.page === page){
      let $option = Img.createOption(img);
      $option.appendTo('#filter');
    }  
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

Img.handleFilter = () => {
  Img.hideImages();
  let selection = $('#filter').val();
  $(`.${selection}`).show();
};

Img.handlePage = () => {
  Img.hideImages();
  $('#filter').val('default');
  let page = $('#page').val();
  $(`.${page}`).show();
};

$(() => {
  Img.readJSON('/data/page-1.json', 'page1');
  Img.readJSON('/data/page-2.json', 'page2');
  $('#filter').change(Img.handleFilter);
  $('#page').change(Img.handlePage);
});







