import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { LaunchDetailsGQL } from '../services/spacexGraphql.service';

@Component({
  selector: 'app-launch-details',
  templateUrl: './launch-details.component.html',
  styleUrls: ['./launch-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchDetailsComponent implements OnInit {

  constructor(private readonly launchDetailsService: LaunchDetailsGQL,
    private readonly route: ActivatedRoute) { }

    launchDetails$ = this.route.paramMap.pipe(
      map(params => params.get('id') as string),
      switchMap(id => this.launchDetailsService.fetch({ id })),
      map(res => res.data.launch)
    );

  ngOnInit(): void {
  }

}
