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
Img.pageData;


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
    .then(() => Img.getPageData())
    .then(() => Img.populateKeyword())
    .then(() => Img.hideImages())
    .then(() => Img.handlePage())
    .then(() => Img.determineSort())
    .then(Img.startListening);
};

Img.loadImgs = (page) => {
  if(page === undefined) page = 'page1';
  Img.allImgs.forEach(img => {
    if(img.page === page) $('.flex-container').append(img.render());
  });
};

Img.getPageData = () => {
  Img.pageData = $('section');
};

Img.populateKeyword = () => {
  const ids = [];
  for(let i = 0; i < Img.pageData.length; i++){
    ids.push(Img.pageData[i].id);
  }
  let options = [...new Set(ids)];
  options.forEach(opt => {
    $('#filter').append(Img.createOption(opt));
  });
};

Img.createOption = img => {
  let $option = $('<option></option>');
  $option.attr('value', img);
  $option.text(img);
  return $option;
};

Img.hideImages = () => {
  $('section').hide();
};

Img.handleFilter = () => {
  Img.hideImages();
  let page = $('#page').val();
  if(page === 'default') page = 'page1';
  let selection = $('#filter').val();
  $(`.${page}.${selection}`).show();
};
 
Img.handlePage = () => {
  let page;
  Img.hideImages();
  $('#filter').val('default');
  $('#sort').val('default');
  $('#page').val() === 'default' ? page = 'page1' : page = $('#page').val();
  $(`.${page}`).show();
};


Img.determineSort = () => {

  $('#sort').val() === 'horn' ? Img.sortBy('horns') : Img.sortBy('title');
};



Img.sortBy= type => {
  let data = Img.allImgs;
  data.sort(Img[type]);
  Img.allImgs = data;
  $('.flex-container').empty();
  Img.loadImgs();
};

Img.title= (a, b) => {
  return a.title.localeCompare(b.title);
};

Img.horns = (a ,b) => {
  return a.horns - b.horns;
};

Img.startListening = () => {
  $('#filter').change(Img.handleFilter);
  $('#page').change(Img.handlePage);
  $('#sort').change(Img.determineSort);
};


$(() => {
  Img.readJSON('/data/page-1.json', 'page1');
  Img.readJSON('/data/page-2.json', 'page2');
});

