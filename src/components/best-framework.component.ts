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