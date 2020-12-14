
const noscript = `<noscript>
      <p class="notice bubble">
        I'm sorry! For this to actully work you have to enable JavaScript in your browser.
      </p>
    </noscript>`
const template = `
    <button id="connect-button" type="button" disabled>🔌 Connect</button>

    <figure class="fast animated">
        <div class="demo bubble"><span class="rabbit tile">🐰</span><span class="carrot tile">🥕</span></div>
        <figcaption>What a tasty looking snack!<br /><small>The carrot feels <span>0</span> % threatened.</small></figcaption>
    </figure>
`

      let lineBuffer = '';
      let latestValue = 0;

      function renderDemo() {
        const rabbit = document.querySelector('.rabbit');
        const percentage = Math.floor(latestValue / 1023 * 100);
        const percentageStatus = document.querySelector('figcaption span');

        rabbit.style.left = 'calc(' + percentage + '% - 2em)';
        percentageStatus.innerText = percentage;

        window.requestAnimationFrame(renderDemo);
      }
      window.requestAnimationFrame(renderDemo);

      async function getReader() {
        port = await navigator.serial.requestPort({});
        await port.open({ baudrate: 9600 });

        connectButton.innerText = '🔌 Disconnect';
        document.querySelector('figure').classList.remove('fadeOut');
        document.querySelector('figure').classList.add('bounceIn');

        const appendStream = new WritableStream({
          write(chunk) {
            lineBuffer += chunk;

            let lines = lineBuffer.split('\n');

            if (lines.length > 1) {
              lineBuffer = lines.pop();
              latestValue = parseInt(lines.pop().trim());
            }
          }
        });

        port.readable
          .pipeThrough(new TextDecoderStream())
          .pipeTo(appendStream);
      }
