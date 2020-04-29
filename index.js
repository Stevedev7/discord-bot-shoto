const Discord = require('discord.js');
const bot = new Discord.Client();

const fetch = require('node-fetch');

let queue = [];
//Commands
bot.on('message', message => {
  if(message.content.match(/^!.*/)){
    let argv = message.content.substring('!'.length).split(' ');
    switch(argv[0]){
      case 'help':
        message.channel.send('This is a help command');
        break;

      case 'greet':
        message.channel.send('Says hi');
        break;

      case 'play':
        queue.push(argv);
        console.log(queue);
        break;

      case 'queue':
        let queueEmbed = new Discord.RichEmbed().setTitle('Queue').setColor(0xf1c40f);
        queue.forEach((song, i) =>{
          queueEmbed.addField(i + 1, song)
        })
        message.channel.send(queueEmbed);
        break;

      case 'roll':
        message.reply(`You get a ${Math.floor(Math.random() * 6) + 1}`);
      break;

      case  'flip':
        message.reply(`You get a ${Math.floor(Math.random() * 2) === 1 ? 'head': 'tail'}.`)
        break;
      case 'woof':
        fetch('https://dog.ceo/api/breeds/image/random').then(data => data.json()).then(data => {
            let dog = new Discord.Attachment(data.message);
            message.reply(dog)
        });
        break;

      case 'anime':
          if(argv[1] === 'top'){
            if (!argv[2]) {
              fetch(`https://api.jikan.moe/v3/top/anime/`)
                .then(data => data.json())
                .then(data => {
                  let { top } = data;
                  let { mal_id } = top[0];
                  fetch(`https://api.jikan.moe/v3/anime/${mal_id}/`)
                    .then(data => data.json())
                    .then(({title, title_japanese, episodes, image_url, trailer_url, url, synopsis, premiered, status, type, score }) => {
                      let send = new Discord.RichEmbed()
                        .setTitle(`${title_japanese}  ( ${title} )`)
                        .setImage(image_url)
                        .setDescription(synopsis)
                        .addField('Episodes', episodes, true)
                        .addField( 'Rating', score, true)
                        .addField(`Type`, type, true)
                        .addField(`Status`, status, true)
                        .addField(`Trailer`, trailer_url)
                        .addField(`Premiered`, premiered)
                        .setURL(url);
                      message.channel.send(send);
                    })
                    .catch(({message}) => console.log(message));
                  })
                .catch(({ message }) => console.log(message));
            }
          }else if(argv[1] === 'rank'){
            if(!isNaN(argv[2])){
              let listIndex = Number(argv[2]);
              const pages = Math.ceil((listIndex) / 50);
              const anime = (listIndex - 1) % 50;
              fetch(`https://api.jikan.moe/v3/top/anime/${pages}`)
                .then(data => data.json())
                .then(data => {
                  let { top } = data;
                  let { mal_id } = top[anime];
                  fetch(`https://api.jikan.moe/v3/anime/${mal_id}/`)
                    .then(data => data.json())
                    .then(({title, title_japanese, episodes, image_url, trailer_url, url, synopsis, premiered, status, type, score,rank }) => {
                      let send = new Discord.RichEmbed()
                        .setTitle(`${title_japanese}  ( ${title} )`)
                        .setImage(image_url)
                        .setDescription(synopsis)
                        .addField('Episodes', episodes, true)
                        .addField( 'Rating', score, true)
                        .addField(`Type`, type, true)
                        .addField(`Status`, status, true)
                        .addField(`Trailer`, trailer_url)
                        .addField(`Premiered`, premiered, true)
                        .addField(`Rank`, rank, true)
                        .setURL(url);
                      message.channel.send(send);
                    })
                  })
                .catch((err) => message.channel.reply(`Error -> ${err.message}`));
            }
          }
        break;

        case 'meow':
          fetch('https://aws.random.cat/meow').then(data => data.json()).then(({file}) => {
              let dog = new Discord.Attachment(file);
              message.reply(dog)
          });
          break;

          case 'fox':
            fetch('https://randomfox.ca/floof/').then(data => data.json()).then(({ image }) => {
                let dog = new Discord.Attachment(image);
                message.reply(dog)
            });
            break;

          case 'corona':
            if (!argv[1]) {
              fetch(`https://api.covid19api.com/summary`)
              .then(data => data.json())
              .then(({Global, Countries, Date}) => {
                let info = new Discord.RichEmbed().setTitle(`Covid-19`)
                  .setTitle('Global')
                  .addField('Total cases', Global.TotalConfirmed, true)
                  .addField('Total recovered', Global.TotalRecovered, true)
                  .addField('Total deaths', Global.TotalDeaths, true)
                  message.channel.send(info);
              });
            } else {
              message.channel.send(argv[1]);

            }
            break;
    }
  }
});

bot.login('NzAzOTAzMTQxMDAyNzM5NzEy.XqVW9A.Kq324jDndSCWrvshoX1U5lrvcQM');
