Template.groupList.helpers({
  peopleMap: function() {
    console.log(this);
    var words = ["alligator", "ant", "bear", "bee", "bird", "camel", "cat", "cheetah", "chicken", "chimpanzee", "cow", "crocodile", "deer", "dog", "dolphin", "duck", "eagle", "elephant", "fish", "fly", "fox", "frog", "giraffe", "goat", "goldfish", "hamster", "hippopotamus", "horse", "kangaroo", "kitten", "lion", "lobster", "monkey", "octopus", "owl", "panda", "pig", "puppy", "rabbit", "rat", "scorpion", "seal", "shark", "sheep", "snail", "snake", "spider", "squirrel", "tiger", "turtle", "wolf", "zebra"];
    var people = this.people; // uh
    var out = [];
    var length = people.length;
    for (var i = 0; i < length; i++) {
      var word = words[Math.floor(Math.random() * words.length)];
      var index = words.indexOf(word);
      if (index > -1) words.splice(index, 1);
      out.push("Anonymous " + capitalizeFirstLetter(word));
    }

    return out;
  }
})

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}