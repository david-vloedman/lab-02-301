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

Img.readJSON = (source, page, sort) => {
  
  $.get(source)
    .then(data => {
      data.forEach(img => {
        Img.allImgs.push(new Img(img, page));
      });
    })
    .then(() => {
      if(sort === 'horn') {
        Img.allImgs.sort(Img.sortByHorn);
        
      }
      if(sort === 'title') Img.allImgs.sort(Img.sortByTitle);
    })
    .then(() => Img.populateKeyword(page))
    .then(() => Img.loadImgs(page));
};

Img.loadImgs = page => {
  Img.allImgs.forEach(img => {
    Img.hideImages();
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
  $('#sort').val('default');
  let page = $('#page').val();
  $(`.${page}`).show();
};

Img.handleSort = () => {
  if($('#sort').val() === 'title') Img.sortByTitle();
  if($('#sort').val() === 'horns') {
    const page = $('page').val();
    let source = page === 'page1' ? '/data/page-1.json' : '/data/page-2.json';
    Img.readJSON(source, page, 'horn');
  }
};

Img.sortByTitle = (a, b) => {
  return a.title.localeCompare(b.title);
};

Img.sortByHorns = (a ,b) => {
  return a.horns - b.horns;
};



$(() => {
  Img.readJSON('/data/page-1.json', 'page1', 'title');
  Img.readJSON('/data/page-2.json', 'page2', 'title');
  $('#filter').change(Img.handleFilter);
  $('#page').change(Img.handlePage);
  $('#sort').change(Img.handleSort);
});







