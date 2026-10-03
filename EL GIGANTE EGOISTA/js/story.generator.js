(function($) {
  $(function() {
    var generator = document.getElementById('story-generator');
    var setupForm = document.getElementById('story-setup-form');
    var timingForm = document.getElementById('story-timing-form');
    var timingFields = document.getElementById('slide-timing-fields');
    var feedback = document.getElementById('generator-feedback');
    var titleInput = document.getElementById('story-name');
    var imageCountInput = document.getElementById('image-count');
    var cover = document.querySelector('.story-cover');
    var storyName = '';
    var imageCount = 0;
    var palettes = [
      {
        name: 'Dulce amanecer',
        colors: {
          '--story-bg-start': '#ffefd1', '--story-bg-middle': '#f8d9ed', '--story-bg-end': '#d5e9ff',
          '--story-ink': '#49345f', '--story-muted': '#665575', '--story-title': '#32164f', '--story-title-accent': '#4b174e',
          '--story-kicker-start': '#ff9d71', '--story-kicker-end': '#ffcf69', '--story-kicker-ink': '#493018',
          '--story-button-start': '#56358c', '--story-button-end': '#70469d', '--story-nav-start': '#8051bf', '--story-nav-end': '#56358c'
        }
      },
      {
        name: 'Bosque encantado',
        colors: {
          '--story-bg-start': '#edf7dc', '--story-bg-middle': '#d8f0dd', '--story-bg-end': '#d2e9f4',
          '--story-ink': '#214037', '--story-muted': '#38564d', '--story-title': '#16392f', '--story-title-accent': '#185b46',
          '--story-kicker-start': '#e4b846', '--story-kicker-end': '#f5d980', '--story-kicker-ink': '#40320d',
          '--story-button-start': '#286b50', '--story-button-end': '#1e4f3d', '--story-nav-start': '#286b50', '--story-nav-end': '#1e4f3d'
        }
      },
      {
        name: 'Reino de lavanda',
        colors: {
          '--story-bg-start': '#eef0ff', '--story-bg-middle': '#dfe8ff', '--story-bg-end': '#d7f1f1',
          '--story-ink': '#253158', '--story-muted': '#414b69', '--story-title': '#202856', '--story-title-accent': '#32318e',
          '--story-kicker-start': '#f0ae77', '--story-kicker-end': '#ffdd8a', '--story-kicker-ink': '#483018',
          '--story-button-start': '#4a469b', '--story-button-end': '#343375', '--story-nav-start': '#4a469b', '--story-nav-end': '#343375'
        }
      },
      {
        name: 'Atardecer de coral',
        colors: {
          '--story-bg-start': '#fff1e8', '--story-bg-middle': '#ffe0d5', '--story-bg-end': '#f9dbe8',
          '--story-ink': '#542a39', '--story-muted': '#673f4c', '--story-title': '#4a1735', '--story-title-accent': '#7a2045',
          '--story-kicker-start': '#f1b268', '--story-kicker-end': '#ffdc99', '--story-kicker-ink': '#4c2b13',
          '--story-button-start': '#9c3458', '--story-button-end': '#752846', '--story-nav-start': '#9c3458', '--story-nav-end': '#752846'
        }
      },
      {
        name: 'Aventura marina',
        colors: {
          '--story-bg-start': '#e7f7f5', '--story-bg-middle': '#d8edf3', '--story-bg-end': '#dce9ff',
          '--story-ink': '#173a56', '--story-muted': '#35536b', '--story-title': '#143b66', '--story-title-accent': '#174f72',
          '--story-kicker-start': '#efad73', '--story-kicker-end': '#ffdf8c', '--story-kicker-ink': '#452b16',
          '--story-button-start': '#246b83', '--story-button-end': '#174f72', '--story-nav-start': '#246b83', '--story-nav-end': '#174f72'
        }
      }
    ];
    var activePalette = palettes[0];

    function formatStartTime(totalSeconds) {
      var minutes = Math.floor(totalSeconds / 60);
      var seconds = (totalSeconds - minutes * 60).toFixed(1);

      if (Number(seconds) >= 60) {
        minutes += 1;
        seconds = '00.0';
      }

      return String(minutes).padStart(2, '0') + ':' + seconds.padStart(4, '0');
    }

    function updateStartTimes() {
      var nextStart = Number(cover.getAttribute('data-narrator-duration')) || 0;
      var cards = timingFields.querySelectorAll('.slide-timing-card');

      Array.prototype.forEach.call(cards, function(card) {
        card.querySelector('[data-slide-start]').textContent = formatStartTime(nextStart);
        nextStart += Number(card.querySelector('input').value) || 0;
      });
    }

    function createTimingFields() {
      var fragment = document.createDocumentFragment();

      for (var index = 1; index <= imageCount; index += 1) {
        var card = document.createElement('fieldset');
        var legend = document.createElement('legend');
        var label = document.createElement('label');
        var input = document.createElement('input');
        var start = document.createElement('p');
        var startTime = document.createElement('time');
        var inputId = 'slide-duration-' + index;

        card.className = 'slide-timing-card';
        legend.textContent = 'Imagen ' + index;
        label.htmlFor = inputId;
        label.textContent = 'Duración (segundos)';
        input.id = inputId;
        input.name = 'duration-' + index;
        input.type = 'number';
        input.min = '0.1';
        input.step = '0.1';
        input.value = '10';
        input.required = true;
        start.className = 'slide-start-time';
        start.appendChild(document.createTextNode('Inicio estimado: '));
        startTime.setAttribute('data-slide-start', '');
        start.appendChild(startTime);
        card.appendChild(legend);
        card.appendChild(label);
        card.appendChild(input);
        card.appendChild(start);
        fragment.appendChild(card);
      }

      timingFields.replaceChildren(fragment);
      updateStartTimes();
    }

    function getPaletteStyle() {
      return Object.keys(activePalette.colors).map(function(property) {
        return property + ':' + activePalette.colors[property] + ';';
      }).join('');
    }

    document.getElementById('palette-button').addEventListener('click', function() {
      var paletteIndex = Math.floor(Math.random() * (palettes.length - 1));
      var currentIndex = palettes.indexOf(activePalette);

      if (paletteIndex >= currentIndex) {
        paletteIndex += 1;
      }

      activePalette = palettes[paletteIndex];
      Object.keys(activePalette.colors).forEach(function(property) {
        document.documentElement.style.setProperty(property, activePalette.colors[property]);
      });
      feedback.textContent = 'Paleta aplicada: ' + activePalette.name + '. Los colores mantienen contraste alto.';
    });

    function escapeHtml(value) {
      return value.replace(/[&<>"']/g, function(character) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;'
        }[character];
      });
    }

    function createStoryHtml(name, durations) {
      var safeName = escapeHtml(name);
      var paletteStyles = getPaletteStyle();
      var audioMarkup = [
        '<source src="audio/audio.mp3" type="audio/mpeg">',
        '<source src="audio/audio.ogg" type="audio/ogg">',
        '<source src="audio/audio.opus" type="audio/ogg; codecs=opus">',
        '<source src="audio/audio.wav" type="audio/wav">',
        '<source src="audio/audio.m4a" type="audio/mp4">',
        '<source src="audio/audio.aac" type="audio/aac">',
        '<source src="audio/audio.webm" type="audio/webm">',
        '<source src="audio/audio.flac" type="audio/flac">'
      ].map(function(source) {
        return '    ' + source;
      }).join('\n');
      var slides = durations.map(function(duration, index) {
        return '    <section class="slide story-illustration" data-narrator-duration="' + duration + '" data-duration="' + Math.round(duration * 1000) + '">\n' +
          '      <img src="imagenes/' + (index + 1) + '.jpg" width="100%" alt="Imagen ' + (index + 1) + ' del cuento ' + safeName + '">\n' +
          '    </section>';
      }).join('\n\n');

      return '<!DOCTYPE html>\n' +
        '<html lang="es">\n' +
        '<head>\n' +
        '  <meta charset="utf-8">\n' +
        '  <meta name="viewport" content="width=device-width, initial-scale=1">\n' +
        '  <base href="./">\n' +
        '  <title>' + safeName + '</title>\n' +
        '  <link rel="stylesheet" href="lib/deck.js/core/deck.core.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/menu/deck.menu.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/navigation/deck.navigation.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/status/deck.status.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/extensions/scale/deck.scale.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.automatic.js/automatic/deck.automatic.css">\n' +
        '  <link rel="stylesheet" href="lib/deck.js/themes/style/web-2.0.css">\n' +
        '  <link rel="stylesheet" href="css/deck.narrator.css">\n' +
        '  <style>:root{' + paletteStyles + '}</style>\n' +
        '  <link rel="stylesheet" href="lib/deck.js/themes/transition/horizontal-slide.css">\n' +
        '  <script src="lib/deck.js/modernizr.custom.js"><\/script>\n' +
        '</head>\n' +
        '<body class="deck-container">\n' +
        '  <section class="slide story-cover" data-narrator-duration="7" data-duration="7000">\n' +
        '    <div class="story-cover-content">\n' +
        '      <p class="story-cover-kicker">¡Abre bien los ojos!</p>\n' +
        '      <h1>' + safeName + '</h1>\n' +
        '      <p class="story-cover-subtitle">Una aventura mágica llena de sorpresas</p>\n' +
        '      <footer>¡Pulsa Play y comienza el cuento!</footer>\n' +
        '    </div>\n' +
        '  </section>\n\n' + slides + '\n\n' +
        '  <nav aria-label="Navegación del cuento">\n' +
        '    <a href="#" class="deck-prev-link" title="Previa" aria-label="Diapositiva anterior">←</a>\n' +
        '    <a href="#" class="deck-next-link" title="Próxima" aria-label="Diapositiva siguiente">→</a>\n' +
        '  </nav>\n' +
        '  <p class="deck-status"><span class="deck-status-current"></span> / <span class="deck-status-total"></span></p>\n' +
        '  <audio controls class="deck-narrator-audio" id="narrator-audio">\n' +
        audioMarkup + '\n' +
        '  </audio>\n' +
        '  <script src="lib/deck.js/jquery.min.js"><\/script>\n' +
        '  <script src="lib/deck.js/core/deck.core.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/menu/deck.menu.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/status/deck.status.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/navigation/deck.navigation.js"><\/script>\n' +
        '  <script src="lib/deck.js/extensions/scale/deck.scale.js"><\/script>\n' +
        '  <script src="lib/deck.automatic.js/automatic/deck.automatic.js"><\/script>\n' +
        '  <script src="js/deck.narrator.js"><\/script>\n' +
        '  <script>\n' +
        '    $(function() {\n' +
        '      $.extend(true, $.deck.defaults, { automatic: { startRunning: false, cycle: false } });\n' +
        '      $.deck(".slide");\n' +
        '    });\n' +
        '  <\/script>\n' +
        '</body>\n' +
        '</html>\n';
    }

    function createDownloadName(name) {
      var fileName = name.replace(/[<>:"/\\|?*\u0000-\u001f]/g, ' ').replace(/\s+/g, ' ').trim().replace(/[. ]+$/, '');

      if (!fileName) {
        fileName = 'cuento infantil';
      }
      if (/^(con|prn|aux|nul|com[1-9]|lpt[1-9])$/i.test(fileName)) {
        fileName = 'cuento ' + fileName;
      }

      return fileName + '.html';
    }

    setupForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!setupForm.reportValidity()) {
        return;
      }

      storyName = titleInput.value.trim();
      var nextImageCount = Number(imageCountInput.value);

      if (!storyName || !Number.isInteger(nextImageCount) || nextImageCount < 1 || nextImageCount > 100) {
        feedback.textContent = 'Escribe un nombre y elige entre 1 y 100 imágenes.';
        return;
      }

      if (imageCount !== nextImageCount) {
        imageCount = nextImageCount;
        createTimingFields();
      }
      setupForm.hidden = true;
      timingForm.hidden = false;
      feedback.textContent = '';
      timingFields.querySelector('input').focus();
    });

    timingFields.addEventListener('input', updateStartTimes);

    document.getElementById('timing-back').addEventListener('click', function() {
      timingForm.hidden = true;
      setupForm.hidden = false;
      feedback.textContent = '';
      titleInput.focus();
    });

    timingForm.addEventListener('submit', function(event) {
      event.preventDefault();

      if (!timingForm.reportValidity()) {
        return;
      }

      var durationInputs = timingFields.querySelectorAll('input[type="number"]');
      var durations = Array.prototype.map.call(durationInputs, function(input) {
        return Number(input.value);
      });

      if (durations.length !== imageCount || durations.some(function(duration) {
        return !Number.isFinite(duration) || duration <= 0;
      })) {
        feedback.textContent = 'Revisa que todas las duraciones sean mayores que cero.';
        return;
      }

      var file = new Blob([createStoryHtml(storyName, durations)], { type: 'text/html;charset=utf-8' });
      var downloadUrl = URL.createObjectURL(file);
      var downloadLink = document.createElement('a');

      downloadLink.href = downloadUrl;
      downloadLink.download = createDownloadName(storyName);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      window.setTimeout(function() {
        URL.revokeObjectURL(downloadUrl);
      }, 1000);
      feedback.textContent = 'Se descargó "' + downloadLink.download + '". El HTML referencia audio/audio.* y no incluye los archivos de audio.';
    });
  });
})(jQuery);
