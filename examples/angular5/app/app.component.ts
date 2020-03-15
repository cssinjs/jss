import {Component, OnInit} from '@angular/core'

import jss from 'jss'

@Component({
  selector: 'app',
  template: `
  <h1 [class]="classes.title">JSS Angular5 example</h1>

  <input [class]="classes.area" type="textarea">

  <div [class]="classes.buttons">      
    <label [class]="classes.redButton" (change)="onRedChanged($event)">
      <input type="radio" name="color" checked>
      Red
    </label>

    <label [class]="classes.greenButton" (change)="onGreenChanged($event)">
      <input type="radio" name="color">
      Green
    </label>

    <label [class]="classes.blueButton" (change)="onBlueChanged($event)">
      <input type="radio" name="color">
      Blue
    </label>
  </div>
  `
})
export class AppComponent implements OnInit {
  public classes: Object

  public onRedChanged: Function
  public onGreenChanged: Function
  public onBlueChanged: Function

  private readonly red: string = '#F44336'
  private readonly green: string = '#4CAF50'
  private readonly blue: string = '#2196F3'

  public ngOnInit(): void {
    const styles: Object = {
      title: {
        textAlign: 'center',
        backgroundColor: '#E0E0E0',
        '&:hover': {
          backgroundColor: '#BDBDBD'
        }
      },
      area: {
        width: '100%',
        height: '10rem',
        color: 'white',
        backgroundColor: data => data.area.backgroundColor
      },
      buttons: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: '1rem'
      },
      redButton: this.createButtonStyle(this.red),
      greenButton: this.createButtonStyle(this.green),
      blueButton: this.createButtonStyle(this.blue)
    }

    const sheet: sheet = jss.createStyleSheet(styles, {link: true}).attach()

    this.classes = sheet.classes

    this.onRedChanged = this.createChangeFunction(sheet, this.red)
    this.onGreenChanged = this.createChangeFunction(sheet, this.green)
    this.onBlueChanged = this.createChangeFunction(sheet, this.blue)

    sheet.update({
      area: {backgroundColor: this.red}
    })
  }

  private createButtonStyle(color: string): Object {
    return {
      flex: 'auto',
      '&:hover': {color}
    }
  }

  private createChangeFunction(sheet: sheet, color: string): (event: Event) => void {
    return (event: Event) => {
      event.stopPropagation()
      event.preventDefault()

      sheet.update({
        area: {backgroundColor: color}
      })
    }
  }
}

interface sheet {
  readonly classes: Object
  readonly update: Function
}
