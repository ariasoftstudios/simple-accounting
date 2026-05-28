import { Component, signal } from '@angular/core';
import { WidgetsWrapper } from '../../components/wigets-wrapper/widgets-wrapper';
import { Widget } from '../../components/widget/widget';
import { WidgetInterface } from '../../interfaces';
import { MOCK_DASHBOARD_WIDGETS } from '../../mock';

@Component({
  selector: 'app-dashboard',
  imports: [WidgetsWrapper, Widget],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  protected readonly widgets = signal<WidgetInterface[]>([]);

  ngOnInit() {
    this.widgets.set(MOCK_DASHBOARD_WIDGETS);
  }
}
