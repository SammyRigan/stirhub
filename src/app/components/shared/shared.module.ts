import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomPipesModule } from 'src/app/pipes/custom-pipes.module';
import { AddPersonComponent } from './add-person/add-person.component';
import { CommentCardComponent } from './comment-card/comment-card.component';
import { CommunityBlockComponent } from './community-block/community-block.component';
import { CreateAnnouncementComponent } from './create-announcement/create-announcement.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { CreateResearchComponent } from './create-research/create-research.component';
import { FollowingComponent } from './following/following.component';
import { GoBackComponent } from './go-back/go-back.component';
import { HeaderComponent } from './header/header.component';
import { InterestsBlockComponent } from './interests-block/interests-block.component';
import { InterestsSelectComponent } from './interests-select/interests-select.component';
import { InvitationComponent } from './invitation/invitation.component';
import { InvitationsBlockComponent } from './invitations-block/invitations-block.component';
import { InvitationsSentComponent } from './invitations-block/invitations-sent/invitations-sent.component';
import { MediaFocusComponent } from './media-focus/media-focus.component';
import { PostCardComponent } from './post-card/post-card.component';
import { PosterComponent } from './poster/poster.component';
import { ProfileBlockComponent } from './profile-block/profile-block.component';
import { ProfileTileComponent } from './profile-tile/profile-tile.component';
import { ResearchComponent } from './research/research.component';
import { TabsComponent } from './tabs/tabs.component';

@NgModule({
  imports: [CommonModule, IonicModule, FormsModule, RouterModule, CustomPipesModule, NgbTooltipModule, NgbDropdownModule],
  declarations: [
    HeaderComponent,
    PostCardComponent,
    PosterComponent,
    MediaFocusComponent,
    CommentCardComponent,
    ResearchComponent,
    AddPersonComponent,
    FollowingComponent,
    ProfileBlockComponent,
    CommunityBlockComponent,
    CreatePollComponent,
    CreateAnnouncementComponent,
    InvitationComponent,
    CreateResearchComponent,
    ProfileTileComponent,
    InterestsSelectComponent,
    TabsComponent,
    InterestsBlockComponent,
    GoBackComponent,
    InvitationsBlockComponent,
    InvitationsSentComponent
  ],
  exports: [
    HeaderComponent,
    PostCardComponent,
    PosterComponent,
    MediaFocusComponent,
    CommentCardComponent,
    ResearchComponent,
    AddPersonComponent,
    FollowingComponent,
    ProfileBlockComponent,
    CommunityBlockComponent,
    CreatePollComponent,
    CreateAnnouncementComponent,
    InvitationComponent,
    CreateResearchComponent,
    ProfileTileComponent,
    InterestsSelectComponent,
    TabsComponent,
    InterestsBlockComponent,
    GoBackComponent,
    InvitationsBlockComponent,
    InvitationsSentComponent
  ]
})
export class SharedModule {}
