const game = {
    tabuleiro: ['','','','','','','','',''],
    jogador: {
                options: ['O','X'],
                nome:['O', 'X'],
                turn_index: 0,
                change(){
                    game.jogador.turn_index = ( game.jogador.turn_index === 0 ? 1:0 );
                }
            },
    container_element: null,
    gameover: false,
    sequencias_vencedoras: [
                        [0,1,2],
                        [3,4,5],
                        [6,7,8],
                        [0,3,6],
                        [1,4,7],
                        [2,5,8],
                        [0,4,8],
                        [2,4,6]
                    ],
    };                    

    // FUNCTIONS
    function init(container) {
        game.container_element = container;
    };

    function teste() {
      Swal.fire('Any fool can use a computer')
    }

    function nomear() {
      swal("Escreva o nome do Jogador O:", {
        content: "input",
      })
      .then((value) => {
        game.jogador.nome[0] = value;
        swal("Escreva o nome do Jogador X:", {
          content: "input",
        })
        .then((value) => {
          game.jogador.nome[1] = value;
          swal('Jogador [O: '+game.jogador.nome[0]+"] [X: "+game.jogador.nome[1]+"]", "", "success");
        });
      });
    }

    function jogar(position) {
        if (game.gameover || game.tabuleiro[position] !== '') return false;

        const currentSymbol = game.jogador.options[game.jogador.turn_index];
        game.tabuleiro[position] = currentSymbol;
        draw();

        const sequencias_vencedoras_index = check_sequencias_vencedoras(currentSymbol);
        if (is_game_over()){
            game_over(true);
        }
        if (sequencias_vencedoras_index >= 0) {
            game_over();
            stylize_winner_sequence(game.sequencias_vencedoras[sequencias_vencedoras_index]);
        } else {
            game.jogador.change();
        }

        return true;
    };

   function stylize_winner_sequence(winner_sequence) {
        winner_sequence.forEach((position) => {
            game
            .container_element
            .querySelector(`div:nth-child(${position + 1})`)
            .classList.add('winner');
        });
      };

    function check_sequencias_vencedoras(symbol) {

        for ( i in game.sequencias_vencedoras ) {
            if (game.tabuleiro[ game.sequencias_vencedoras[i][0] ] == symbol  &&
                game.tabuleiro[ game.sequencias_vencedoras[i][1] ] == symbol &&
                game.tabuleiro[ game.sequencias_vencedoras[i][2] ] == symbol) {
                console.log('winning sequences INDEX:' + i);
                return i;
            }
        };
        return -1;
    };

    function game_over(empate) {
        game.gameover = true;
        if(empate){
            swal("GAME OVER!","Ninguém Venceu a partida!!!", {
                icon: "error",
                buttons: {
                  cancel: "Fechar",
                  restart: {
                    text: "Reiniciar",
                    value: "restart",
                  },
                },
              })
              .then((value) => {
                switch (value) {
                  case "restart":
                    restart();
                    swal("Jogo Reiniciado!", "Boa Sorte!!!", {
                        icon: "success",
                        buttons: false,
                        timer: 2000
                    });
                    break;
               
                  default:
                }
              });
        }else {
          swal("GAME OVER!","Jogador "+game.jogador.nome[game.jogador.turn_index]+" Venceu", {
            icon: "success",
            buttons: {
              cancel: "Fechar",
              restart: {
                text: "Reiniciar",
                value: "restart",
              },
            },
          })
          .then((value) => {
            switch (value) {
              case "restart":
                restart();
                swal("Jogo Reiniciado!", "Boa Sorte!!!", {
                    icon: "success",
                    buttons: false,
                    timer: 2000
                });
                break;
           
              default:
            }
          });
        }
    };

    function is_game_over() {
        return !game.tabuleiro.includes('');
    };

    function start() {
        game.tabuleiro.fill('');
        draw();
        game.gameover = false;       
    };

    function restart() {
        if (is_game_over() || game.gameover) {
            start();
        } else {
            swal({
                title: "Tem Certeza?",
                text: "O jogo atual sera perdido!",
                icon: "warning",
                buttons: true,
                dangerMode: true,
              })
              .then((willDelete) => {
                if (willDelete) {
                  swal("Poof! Jogo Reiniciado!", {
                    icon: "success",
                    timer: 1000,
                    buttons: false
                  });
                  start();
                } else {
                }
              });
        }
    };

    function draw() {
        game.container_element.innerHTML = game.tabuleiro.map((element, index) => `<div onclick="jogar('${index}')"> ${element} </div>`).reduce((content, current) => content + current);
    };