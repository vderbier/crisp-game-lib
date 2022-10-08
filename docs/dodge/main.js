title = "DODGE";

description = `
[Hold] Speed up
[Release] Dodge
`;

characters = [
`
    ll
   l 
 llll
l l
ll l
    l
`,`
    ll
   l
 lll
  l  
 ll
 ll 
`,
];

options = {
  viewSize: {x: 200, y: 50},
  seed: 7,
};

/** @type {{x: number, speed: number, width: number}[]} */
let rocks;
let nextRockTicks;

/** @type {{x: number, vx: number, y: number}} */
let player;
let separateLine;
let currRockSpeed;

function update() {
  if (!ticks) {
    rocks = [];
    nextRockTicks = 0;
    player = { x: 20, vx: 0, y: 0 };
    separateLine = 100;
    currRockSpeed = 0;
  }

  let scr = difficulty * 0.1;

  if (player.x > 30) {
    scr += (player.x - 30) * 0.1;
  }
  if (player.y > 0) {
    scr = 0;
  }
  // create ground and line 
  color("black");
  rect(0, 40, 200, 10);
  color("light_black");
  separateLine = wrap(separateLine - scr, 0, 200);
  rect(separateLine, 40, 1, 10);

  // spawn obstacles
  nextRockTicks--;
  text(nextRockTicks.toString(), 10, 10);
  if (nextRockTicks < 0) {
    rocks.push({
      x: 210,
      speed: rnd(1.0, 2.0) * difficulty,
      width: rnd (5, 10) * (difficulty * 1.5)
    })
    nextRockTicks = 100 / sqrt(difficulty);
  }
  color("red");
  remove(rocks, (r) => {
    r.x -= scr;
    rect(r.x, 37, r.width, 1);
    return (r.x < 0 - r.width);
  });

  if (player.y > 0) {
    player.y++;
    text(player.y.toString(), 3, 10);
    char("a", player.x, 37 + player.y, { mirror: { y: -1 } });
    if (37 + player.y > 45) {
      play("explosion");
      end();
    }
  } else {
    if (input.isJustPressed) {
      play("click");
    }
    player.vx *= 0.99;
    player.x += player.vx - scr;
    if (player.x < 0) {
      play("explosion");
      end();
    }
    // make player advance
    if (input.isPressed) {
      player.vx += difficulty * 0.02;
      // if player hits obstacle while running
      color("transparent");
      if (char("a", player.x, 37).isColliding.rect.red) {
        play("explosion");
        end();
      }
    }
    // check if collision with rock
    input.isPressed ? 
      color("black"):
      color("light_black");

    char(addWithCharCode("a", floor(ticks / 20) % 2), 
         player.x, 
         37);
  }


}
