import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { PastLaunchesListGQL } from '../services/spacexGraphql.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-launch-list',
  templateUrl: './launch-list.component.html',
  styleUrls: ['./launch-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LaunchListComponent implements OnInit {

  constructor(private readonly pastLaunchesService: PastLaunchesListGQL) { }

  // limit the num of items fetched
  pastLaunches$ = this.pastLaunchesService
    .fetch({ limit: 99 })

    // we pipe and extract our query data
    // res has other information such as errors, loading states, etc. as well, which we don't require
    .pipe(
      map(
        (res) => res.data.launchesPast
      )
    );


  ngOnInit(): void {
  }

}
