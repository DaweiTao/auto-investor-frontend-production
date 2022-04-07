import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ChartsService, Hoverdata } from 'src/app/services/charts.service';

@Component({
  selector: 'app-hover-info-panel',
  templateUrl: './hover-info-panel.component.html',
  styleUrls: ['./hover-info-panel.component.css']
})
export class HoverInfoPanelComponent implements OnInit, OnDestroy {
  private hoverDataSub: Subscription = new Subscription()
  public currentHoverData: Hoverdata | null = null

  constructor(private cs: ChartsService) { }

  ngOnInit(): void {
    this.cs.hoverData$.subscribe(hoverData => {
      this.currentHoverData = hoverData
    })
  }

  ngOnDestroy(): void {
    this.hoverDataSub.unsubscribe()
  }
}
