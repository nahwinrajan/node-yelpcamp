let mongoose      = require("mongoose");
let Campground    = require("./models/campground");
let Comment       = require("./models/comment");

let objCommentYoda = { message: "among the trees we slept.", author: "yoda"};
let objCommentLeia = { message: "love the bonfire!!", author: "Princess Leia"};

let data = [
  {
    name: "Salmon Creek",
    image: "https://farm6.staticflickr.com/5181/5641024448_04fefbb64d.jpg",
    price:"9",
    rating: "4",
    description: "<p>Dreamcatcher coloring book fashion axe, microdosing woke gochujang tumblr VHS pork belly put a bird on it everyday carry hammock pickled. Pabst kale chips mixtape chillwave, yr lumbersexual succulents tbh keffiyeh migas 3 wolf moon poutine lomo asymmetrical 90's. Hammock chillwave freegan, fap biodiesel meggings aesthetic shabby chic kogi marfa pinterest thundercats. Street art authentic vice, sartorial meh photo booth brooklyn semiotics coloring book master cleanse tilde mlkshk. Lyft chillwave freegan, single-origin coffee typewriter man bun sartorial four loko vaporware kinfolk. Craft beer hot chicken ethical bitters photo booth biodiesel, williamsburg edison bulb master cleanse freegan umami. Air plant cray succulents scenester, lo-fi chartreuse mixtape leggings raclette.</p><p>Small batch swag shoreditch farm-to-table af synth trust fund. Kinfolk pour-over blog health goth butcher taxidermy. Chillwave actually tote bag, tofu roof party activated charcoal raw denim heirloom art party kitsch tattooed direct trade offal bespoke PBR&B. Celiac polaroid sustainable, af post-ironic schlitz whatever air plant lo-fi affogato lumbersexual retro. Blog gentrify PBR&B retro direct trade. 8-bit actually YOLO thundercats live-edge bespoke. Activated charcoal cardigan keffiyeh, biodiesel hot chicken fixie unicorn art party lyft.</p><p>Hella freegan lo-fi food truck. Readymade lumbersexual poke +1. Heirloom hashtag lomo readymade kombucha sartorial, pok pok chambray hammock butcher migas cred shoreditch master cleanse chillwave. Hella occupy dreamcatcher, deep v meh vaporware cold-pressed. Prism schlitz hashtag pitchfork typewriter swag. Jean shorts small batch brooklyn literally, biodiesel microdosing truffaut copper mug pork belly roof party succulents. Sriracha activated charcoal single-origin coffee fanny pack yr.</p><p>Williamsburg microdosing gentrify, mustache pickled fam wolf sriracha ramps stumptown quinoa art party. Blue bottle cold-pressed sartorial church-key. Disrupt shoreditch whatever, drinking vinegar bitters you probably haven't heard of them retro blue bottle bicycle rights flexitarian post-ironic. Direct trade asymmetrical enamel pin tousled snackwave. Banh mi knausgaard gluten-free irony VHS, hell of biodiesel chicharrones post-ironic distillery neutra franzen celiac raclette man braid. Everyday carry heirloom biodiesel trust fund bitters, brunch leggings you probably haven't heard of them YOLO pabst post-ironic lumbersexual. Vape knausgaard etsy, kale chips iPhone drinking vinegar listicle ethical paleo tumeric leggings ramps.</p><p>Snackwave fam poutine godard VHS. Vegan portland sriracha cliche gluten-free, blog shoreditch street art. Four loko mustache lumbersexual, quinoa squid hashtag organic gluten-free beard neutra tumblr 90's hot chicken fap butcher. Selvage try-hard fingerstache hella, coloring book typewriter cardigan pop-up pour-over health goth farm-to-table ramps. Kale chips scenester banh mi, hammock cliche yuccie kickstarter offal crucifix mumblecore wayfarers food truck lyft. 90's lyft lumbersexual pour-over truffaut cliche 3 wolf moon. Polaroid fixie photo booth, iPhone occupy tbh twee knausgaard.</p>"
  },
  {
    name: "Granite Hill",
    image: "https://farm9.staticflickr.com/8422/7842069486_c61e4c6025.jpg",
    price:"7.5",
    rating: "3.5",
    description: "<p>Dreamcatcher coloring book fashion axe, microdosing woke gochujang tumblr VHS pork belly put a bird on it everyday carry hammock pickled. Pabst kale chips mixtape chillwave, yr lumbersexual succulents tbh keffiyeh migas 3 wolf moon poutine lomo asymmetrical 90's. Hammock chillwave freegan, fap biodiesel meggings aesthetic shabby chic kogi marfa pinterest thundercats. Street art authentic vice, sartorial meh photo booth brooklyn semiotics coloring book master cleanse tilde mlkshk. Lyft chillwave freegan, single-origin coffee typewriter man bun sartorial four loko vaporware kinfolk. Craft beer hot chicken ethical bitters photo booth biodiesel, williamsburg edison bulb master cleanse freegan umami. Air plant cray succulents scenester, lo-fi chartreuse mixtape leggings raclette.</p><p>Small batch swag shoreditch farm-to-table af synth trust fund. Kinfolk pour-over blog health goth butcher taxidermy. Chillwave actually tote bag, tofu roof party activated charcoal raw denim heirloom art party kitsch tattooed direct trade offal bespoke PBR&B. Celiac polaroid sustainable, af post-ironic schlitz whatever air plant lo-fi affogato lumbersexual retro. Blog gentrify PBR&B retro direct trade. 8-bit actually YOLO thundercats live-edge bespoke. Activated charcoal cardigan keffiyeh, biodiesel hot chicken fixie unicorn art party lyft.</p><p>Hella freegan lo-fi food truck. Readymade lumbersexual poke +1. Heirloom hashtag lomo readymade kombucha sartorial, pok pok chambray hammock butcher migas cred shoreditch master cleanse chillwave. Hella occupy dreamcatcher, deep v meh vaporware cold-pressed. Prism schlitz hashtag pitchfork typewriter swag. Jean shorts small batch brooklyn literally, biodiesel microdosing truffaut copper mug pork belly roof party succulents. Sriracha activated charcoal single-origin coffee fanny pack yr.</p><p>Williamsburg microdosing gentrify, mustache pickled fam wolf sriracha ramps stumptown quinoa art party. Blue bottle cold-pressed sartorial church-key. Disrupt shoreditch whatever, drinking vinegar bitters you probably haven't heard of them retro blue bottle bicycle rights flexitarian post-ironic. Direct trade asymmetrical enamel pin tousled snackwave. Banh mi knausgaard gluten-free irony VHS, hell of biodiesel chicharrones post-ironic distillery neutra franzen celiac raclette man braid. Everyday carry heirloom biodiesel trust fund bitters, brunch leggings you probably haven't heard of them YOLO pabst post-ironic lumbersexual. Vape knausgaard etsy, kale chips iPhone drinking vinegar listicle ethical paleo tumeric leggings ramps.</p><p>Snackwave fam poutine godard VHS. Vegan portland sriracha cliche gluten-free, blog shoreditch street art. Four loko mustache lumbersexual, quinoa squid hashtag organic gluten-free beard neutra tumblr 90's hot chicken fap butcher. Selvage try-hard fingerstache hella, coloring book typewriter cardigan pop-up pour-over health goth farm-to-table ramps. Kale chips scenester banh mi, hammock cliche yuccie kickstarter offal crucifix mumblecore wayfarers food truck lyft. 90's lyft lumbersexual pour-over truffaut cliche 3 wolf moon. Polaroid fixie photo booth, iPhone occupy tbh twee knausgaard.</p>"
  },
  {
    name: "Green Meadow",
    image: "https://farm8.staticflickr.com/7258/7121861565_3f4957acb1.jpg",
    price:"5",
    rating: "3",
    description: "<p>Dreamcatcher coloring book fashion axe, microdosing woke gochujang tumblr VHS pork belly put a bird on it everyday carry hammock pickled. Pabst kale chips mixtape chillwave, yr lumbersexual succulents tbh keffiyeh migas 3 wolf moon poutine lomo asymmetrical 90's. Hammock chillwave freegan, fap biodiesel meggings aesthetic shabby chic kogi marfa pinterest thundercats. Street art authentic vice, sartorial meh photo booth brooklyn semiotics coloring book master cleanse tilde mlkshk. Lyft chillwave freegan, single-origin coffee typewriter man bun sartorial four loko vaporware kinfolk. Craft beer hot chicken ethical bitters photo booth biodiesel, williamsburg edison bulb master cleanse freegan umami. Air plant cray succulents scenester, lo-fi chartreuse mixtape leggings raclette.</p><p>Small batch swag shoreditch farm-to-table af synth trust fund. Kinfolk pour-over blog health goth butcher taxidermy. Chillwave actually tote bag, tofu roof party activated charcoal raw denim heirloom art party kitsch tattooed direct trade offal bespoke PBR&B. Celiac polaroid sustainable, af post-ironic schlitz whatever air plant lo-fi affogato lumbersexual retro. Blog gentrify PBR&B retro direct trade. 8-bit actually YOLO thundercats live-edge bespoke. Activated charcoal cardigan keffiyeh, biodiesel hot chicken fixie unicorn art party lyft.</p><p>Hella freegan lo-fi food truck. Readymade lumbersexual poke +1. Heirloom hashtag lomo readymade kombucha sartorial, pok pok chambray hammock butcher migas cred shoreditch master cleanse chillwave. Hella occupy dreamcatcher, deep v meh vaporware cold-pressed. Prism schlitz hashtag pitchfork typewriter swag. Jean shorts small batch brooklyn literally, biodiesel microdosing truffaut copper mug pork belly roof party succulents. Sriracha activated charcoal single-origin coffee fanny pack yr.</p><p>Williamsburg microdosing gentrify, mustache pickled fam wolf sriracha ramps stumptown quinoa art party. Blue bottle cold-pressed sartorial church-key. Disrupt shoreditch whatever, drinking vinegar bitters you probably haven't heard of them retro blue bottle bicycle rights flexitarian post-ironic. Direct trade asymmetrical enamel pin tousled snackwave. Banh mi knausgaard gluten-free irony VHS, hell of biodiesel chicharrones post-ironic distillery neutra franzen celiac raclette man braid. Everyday carry heirloom biodiesel trust fund bitters, brunch leggings you probably haven't heard of them YOLO pabst post-ironic lumbersexual. Vape knausgaard etsy, kale chips iPhone drinking vinegar listicle ethical paleo tumeric leggings ramps.</p><p>Snackwave fam poutine godard VHS. Vegan portland sriracha cliche gluten-free, blog shoreditch street art. Four loko mustache lumbersexual, quinoa squid hashtag organic gluten-free beard neutra tumblr 90's hot chicken fap butcher. Selvage try-hard fingerstache hella, coloring book typewriter cardigan pop-up pour-over health goth farm-to-table ramps. Kale chips scenester banh mi, hammock cliche yuccie kickstarter offal crucifix mumblecore wayfarers food truck lyft. 90's lyft lumbersexual pour-over truffaut cliche 3 wolf moon. Polaroid fixie photo booth, iPhone occupy tbh twee knausgaard.</p>"
  },
  {
    name: "Dawson Creek",
    image: "https://farm5.staticflickr.com/4027/4368764673_c8345bd602.jpg",
    price:"6",
    rating: "3",
    description: "<p>Dreamcatcher coloring book fashion axe, microdosing woke gochujang tumblr VHS pork belly put a bird on it everyday carry hammock pickled. Pabst kale chips mixtape chillwave, yr lumbersexual succulents tbh keffiyeh migas 3 wolf moon poutine lomo asymmetrical 90's. Hammock chillwave freegan, fap biodiesel meggings aesthetic shabby chic kogi marfa pinterest thundercats. Street art authentic vice, sartorial meh photo booth brooklyn semiotics coloring book master cleanse tilde mlkshk. Lyft chillwave freegan, single-origin coffee typewriter man bun sartorial four loko vaporware kinfolk. Craft beer hot chicken ethical bitters photo booth biodiesel, williamsburg edison bulb master cleanse freegan umami. Air plant cray succulents scenester, lo-fi chartreuse mixtape leggings raclette.</p><p>Small batch swag shoreditch farm-to-table af synth trust fund. Kinfolk pour-over blog health goth butcher taxidermy. Chillwave actually tote bag, tofu roof party activated charcoal raw denim heirloom art party kitsch tattooed direct trade offal bespoke PBR&B. Celiac polaroid sustainable, af post-ironic schlitz whatever air plant lo-fi affogato lumbersexual retro. Blog gentrify PBR&B retro direct trade. 8-bit actually YOLO thundercats live-edge bespoke. Activated charcoal cardigan keffiyeh, biodiesel hot chicken fixie unicorn art party lyft.</p><p>Hella freegan lo-fi food truck. Readymade lumbersexual poke +1. Heirloom hashtag lomo readymade kombucha sartorial, pok pok chambray hammock butcher migas cred shoreditch master cleanse chillwave. Hella occupy dreamcatcher, deep v meh vaporware cold-pressed. Prism schlitz hashtag pitchfork typewriter swag. Jean shorts small batch brooklyn literally, biodiesel microdosing truffaut copper mug pork belly roof party succulents. Sriracha activated charcoal single-origin coffee fanny pack yr.</p><p>Williamsburg microdosing gentrify, mustache pickled fam wolf sriracha ramps stumptown quinoa art party. Blue bottle cold-pressed sartorial church-key. Disrupt shoreditch whatever, drinking vinegar bitters you probably haven't heard of them retro blue bottle bicycle rights flexitarian post-ironic. Direct trade asymmetrical enamel pin tousled snackwave. Banh mi knausgaard gluten-free irony VHS, hell of biodiesel chicharrones post-ironic distillery neutra franzen celiac raclette man braid. Everyday carry heirloom biodiesel trust fund bitters, brunch leggings you probably haven't heard of them YOLO pabst post-ironic lumbersexual. Vape knausgaard etsy, kale chips iPhone drinking vinegar listicle ethical paleo tumeric leggings ramps.</p><p>Snackwave fam poutine godard VHS. Vegan portland sriracha cliche gluten-free, blog shoreditch street art. Four loko mustache lumbersexual, quinoa squid hashtag organic gluten-free beard neutra tumblr 90's hot chicken fap butcher. Selvage try-hard fingerstache hella, coloring book typewriter cardigan pop-up pour-over health goth farm-to-table ramps. Kale chips scenester banh mi, hammock cliche yuccie kickstarter offal crucifix mumblecore wayfarers food truck lyft. 90's lyft lumbersexual pour-over truffaut cliche 3 wolf moon. Polaroid fixie photo booth, iPhone occupy tbh twee knausgaard.</p>"
  }
];

function seedDB() {
  Campground.remove({}, (err) => {
    if (err) {
      console.log("seedDB - error while cleaning db \n", error);
    } else {
      console.log("removed Campgrounds!");
    }
  });

  Comment.remove({}, (err) => {
    if (err) {
      console.log(error);
    } else {
      console.log("removed Comments!");
    }
  });

  // //adding some initial/sample data
  // data.forEach((seed) => {
  //   Campground.create(seed, (err, campground) => {
  //     if(err) {
  //       console.log("seedDB - error while adding sample campground to db \n", error);
  //     } else {
  //       console.log("added Campgrounds!");
  //       Comment.create(objCommentYoda, (err, cmt) => {
  //         if (err) {
  //           console.log(err);
  //         } else {
  //           campground.comments.push(cmt);
  //           campground.save();
  //           console.log("yoda's comment added");
  //         }
  //       });
  //     }
  //   });
  // });
}

module.exports = seedDB;
