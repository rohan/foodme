var words = ["alligator", "ant", "bear", "bee", "bird", "camel",
"cat", "cheetah", "chicken", "chimpanzee", "cow", "crocodile", 
"deer", "dog", "dolphin", "duck", "eagle", "elephant", "fish", 
"fly", "fox", "frog", "giraffe", "goat", "goldfish", "hamster", 
"hippopotamus", "horse", "kangaroo", "kitten", "lion", "lobster", 
"monkey", "octopus", "owl", "panda", "pig", "puppy", "rabbit", "rat", 
"scorpion", "seal", "shark", "sheep", "snail", "snake", "spider", 
"squirrel", "tiger", "turtle", "wolf", "zebra"];

Template.singleGroup.helpers({
  peopleMap: function(person) {
    var word = words[Math.floor(Math.random() * words.length)];
    var index = words.indexOf(word);
    if (index > -1) words.splice(index, 1);
    return "Anonymous " + capitalizeFirstLetter(word);
  },

  createGM: function() {
    return Session.get("groupme");
  }
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

Template.singleGroup.rendered = function() {
  console.log(this);
  if (this.data.atCapacity == true) {
    var people = this.data.people;
    var url = Meteor.call("createGM", this.data.name + "group", people, function(err, res) {
      console.log("url:", res);
      Session.set("groupme", res);
    });
  }
}