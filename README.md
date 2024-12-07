# Using Angular Inside of Astro
## What is Astro?
Astro is a framework to build websites and web apps in a way to optimize performance and progressive enhancement.  It does this by allowing for a "zero-bundle" strategy sent over the wire.  It uses a mix of static site generation, server-side rendering, and partial hydration to let developers opt-in to how much javascript they want to send to their users in an incremental fashion.  While this blog is not about what Astro is nor is it about why would we use it, I do have a [blog](https://dev.to/paulmojicatech/evolution-of-web-development-3dp2) that discusses the evolution of web development and reasons why it may be useful to try out technologies like Astro.

## What is AnalogJs
AnalogJs is a metaframework for Angular built by [Brandon Roberts](https://dev.to/brandontroberts).  To me, it is to Angular developers what Next.js is to React developers (and, as we will see with this blog, more).  It provides things like file-system routing, server-side rendering, and partial hydration.  These are all things that the Angular ecosystem, until recently with the release of v19, has been lacking.

## But there is more...
Because of the work Brandon is doing with AnalogJs and using Vite as the build system, we can now embed Angular components within an Astro application.  There are already integrations for React, Svelte, and Vue for Astro, and now there is an Angular option as well.

## Let's get to it
Below are the steps to embed an Angular component into your Astro application

First we need to create an Astro project.  To do this, run `npm create astro@latest -- --template minimal`.  [From Astro docs](https://docs.astro.build/en/tutorial/1-setup/2/)
Next, follow the steps on the [AnalogJs docs](https://analogjs.org/docs/packages/astro-angular/overview)
Run `npx astro add @analogjs/astro-angular`
Add a tsconfig.app.json file to the root of your project
```json
{
  "extends": "./tsconfig.json",
  "compileOnSave": false,
  "compilerOptions": {
    "baseUrl": "./",
    "outDir": "./dist/out-tsc",
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "sourceMap": true,
    "declaration": false,
    "downlevelIteration": true,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "noEmit": false,
    "target": "es2020",
    "module": "es2020",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true,
    "allowJs": false
  },
  "files": [],
  "include": ["src/**/*.ts", "src/**/*.tsx"]
}
```
Add the AnalogJs/Angular integration into your `astro.config.mjs` file at the root of your project and enable Vite for the integration.
```js
// @ts-check
// @ts-check
import { defineConfig } from 'astro/config';

import analogjsangular from '@analogjs/astro-angular';

// https://astro.build/config
export default defineConfig({
  integrations: [analogjsangular({
    vite: {
      inlineStylesExtension: 'scss|sass|less'
    }
  })],
  vite: {
    ssr: {
      // transform these packages during SSR. Globs supported
      noExternal: ['@rx-angular/**'],
    }
  }
});
```
Create your Angular component, using inline styles and inline templating.
```js
import {Component, EventEmitter, Output, output} from '@angular/core';

@Component({
  selector: 'pmt-best-framework',
  standalone: true,
  imports: [],
  template: `
    <section>
      <p>What is the best frontend framework?</p>
      <div class="frameworks">
        <form>
          <fieldset>
            <legend>Select the best framework</legend>
            <div class="question-container">
              <label>
                <input (click)="handleSelectFramework('angular')" type="radio" id="angular" name="framework" value="angular"/>
                <span>Angular</span>
              </label>
              <label>
                <input (click)="handleSelectFramework('react')" type="radio" id="react" name="framework" value="react"/>
                <span>React</span>
              </label>
              <label>
                <input (click)="handleSelectFramework('vue')" type="radio" id="vue" name="framework" value="vue"/>
                <span>Vue</span>
              </label>
              <label>
                <input (click)="handleSelectFramework('svelte')" type="radio" id="other" name="framework" value="svelte"/>
                <span>Svelte</span>
              </label>
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  `,
  styles: `
    section {
      display: flex;
      flex-direction: column;
      width: 100%;
    }
    .question-container {
      display: flex;
      flex-direction: column;
      width: 100%;
      justify-content: center;
    }
  `
})
export class BestFrameworkComponent {

  @Output() selectFrameworkEv = new EventEmitter<'angular' | 'react' | 'vue' | 'svelte'>();

  handleSelectFramework(framework: 'angular' | 'react' | 'vue' | 'svelte') {
    this.selectFrameworkEv.emit(framework);
  }

}
```
Update your Astro page to include the Angular component.  We can create a script tag to listen for outputs using `addOutputListener` from `@analogjs/astro-angular/utils`

```js
---
import {BestFrameworkComponent} from '../components/best-framework.component';

---

<html lang="en">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		<title>Astro</title>
	</head>
	<body>
		<h1>Astro</h1>
		<BestFrameworkComponent data-analog-id="bestFrameworkCmp"  client:visible />
		<div id="answer">

		</div>
		<script>
			import { addOutputListener } from '@analogjs/astro-angular/utils';

			addOutputListener('bestFrameworkCmp', 'selectFrameworkEv', (output) => {
				const answer = document.querySelector('#answer') as HTMLDivElement;
				let answerText;
				switch (output.detail) {
					case 'angular':
						answer.style.color = 'green';
						answerText = 'Good job!';
						break;
					case 'react':
						answer.style.color = 'red';
						answerText = 'React is not a framework, but even if it was you would still be wrong';
						break;
					case 'vue':
						answer.style.color = 'red';
						answerText = 'Vue is not bad, but try again';
						break;
					case 'svelte':
						answer.style.color = 'red';
						answerText = 'Close but no cigar';
						break;
					default:
						break;
				}
				answer.innerHTML = answerText as string;
			});

		</script>
	</body>
</html>
```

## That's all folks!
And now we have integrated an Angular component inside of Astro.  Hope you all had fun reading this.

[Github](https://github.com/paulmojicatech/astro-analog-blog)
[Follow me at Bluesky](https://bsky.app/profile/paulmojicatech.com)
[LinkedIn](https://www.linkedin.com/in/paulmojicatech/)