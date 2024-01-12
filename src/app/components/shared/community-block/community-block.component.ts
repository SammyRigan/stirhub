import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-community-block',
  templateUrl: './community-block.component.html',
  styleUrls: ['./community-block.component.scss'],
})
export class CommunityBlockComponent implements OnInit {

  communities = [];

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.getCommunities();
  }

  async getCommunities() {
    const res = await this.dataService.returnItemsRaw('communities', 3, 1, []);
    this.communities = res.data;
  }

}
