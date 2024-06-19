import { Component,Input} from '@angular/core';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent {
  @Input() event_content?:any;
  
  // ngOnInit() {
  //   console.log("event content", this.event_content)
  // }
}
