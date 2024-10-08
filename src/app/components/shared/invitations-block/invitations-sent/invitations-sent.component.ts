/* eslint-disable no-underscore-dangle */
/* eslint-disable max-len */
import { Component, Input, OnInit } from '@angular/core';
import { LoadingController, ModalController, ToastController } from '@ionic/angular';
import { UserProfile } from 'src/app/models/models';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-invitations-sent',
  templateUrl: './invitations-sent.component.html',
  styleUrls: ['./invitations-sent.component.scss'],
})
export class InvitationsSentComponent implements OnInit {

  @Input() profile: UserProfile;
  @Input() signed: boolean;

  invitations = [];

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private generalService: GeneralService
  ) { }

  ngOnInit() {
    this.getInvitations();
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async getInvitations() {
    const filters = [];
    filters.push({key: 'profileId', value: this.profile._id});
    if (this.signed) {
      filters.push({key: 'onboard', value: true});
    }
    const res = await this.generalService.getItemWithFilter('invitations', null, filters, 100);
    this.invitations = res.docs.map(e => ({
      id: e.id,
      ...e.data() as any
    }));
    // console.log(this.invitations);
  }

  async sendInvite(inviteId: string, email: string) {
    const invitation = {
      id: null,
      date: Date.now().toString(),
      to: [email],
      message: {
        subject: 'Hello from The StirHub!',
        text: `You have been invited by. ${this.profile.name ? this.profile.name : this.profile.firstname + ' ' + this.profile.lastname}`,
        html: null
      }
    };
    email = email.trim();
    const loading = await this.loadingCtrl.create();
    await loading.present();
    invitation.message.html = `
    <!doctype html>
<html ⚡4email data-css-strict>

<head>
  <meta charset="utf-8">
  <style amp4email-boilerplate>
    body {
      visibility: hidden
    }
  </style>
  <script async src="https://cdn.ampproject.org/v0.js"></script>
  <style amp-custom>
    .es-desk-hidden {
      display: none;
      float: left;
      overflow: hidden;
      width: 0;
      max-height: 0;
      line-height: 0;
    }

    s {
      text-decoration: line-through;
    }

    body {
      width: 100%;
    }

    body {
      font-family: lato, "helvetica neue", helvetica, arial, sans-serif;
    }

    table {
      border-collapse: collapse;
      border-spacing: 0px;
    }

    table td,
    html,
    body,
    .es-wrapper {
      padding: 0;
      Margin: 0;
    }

    .es-content,
    .es-header,
    .es-footer {
      table-layout: fixed;
      width: 100%;
    }

    p,
    hr {
      Margin: 0;
    }

    h1,
    h2,
    h3,
    h4,
    h5 {
      Margin: 0;
      line-height: 120%;
      font-family: lato, "helvetica neue", helvetica, arial, sans-serif;
    }

    .es-left {
      float: left;
    }

    .es-right {
      float: right;
    }

    .es-p5 {
      padding: 5px;
    }

    .es-p5t {
      padding-top: 5px;
    }

    .es-p5b {
      padding-bottom: 5px;
    }

    .es-p5l {
      padding-left: 5px;
    }

    .es-p5r {
      padding-right: 5px;
    }

    .es-p10 {
      padding: 10px;
    }

    .es-p10t {
      padding-top: 10px;
    }

    .es-p10b {
      padding-bottom: 10px;
    }

    .es-p10l {
      padding-left: 10px;
    }

    .es-p10r {
      padding-right: 10px;
    }

    .es-p15 {
      padding: 15px;
    }

    .es-p15t {
      padding-top: 15px;
    }

    .es-p15b {
      padding-bottom: 15px;
    }

    .es-p15l {
      padding-left: 15px;
    }

    .es-p15r {
      padding-right: 15px;
    }

    .es-p20 {
      padding: 20px;
    }

    .es-p20t {
      padding-top: 20px;
    }

    .es-p20b {
      padding-bottom: 20px;
    }

    .es-p20l {
      padding-left: 20px;
    }

    .es-p20r {
      padding-right: 20px;
    }

    .es-p25 {
      padding: 25px;
    }

    .es-p25t {
      padding-top: 25px;
    }

    .es-p25b {
      padding-bottom: 25px;
    }

    .es-p25l {
      padding-left: 25px;
    }

    .es-p25r {
      padding-right: 25px;
    }

    .es-p30 {
      padding: 30px;
    }

    .es-p30t {
      padding-top: 30px;
    }

    .es-p30b {
      padding-bottom: 30px;
    }

    .es-p30l {
      padding-left: 30px;
    }

    .es-p30r {
      padding-right: 30px;
    }

    .es-p35 {
      padding: 35px;
    }

    .es-p35t {
      padding-top: 35px;
    }

    .es-p35b {
      padding-bottom: 35px;
    }

    .es-p35l {
      padding-left: 35px;
    }

    .es-p35r {
      padding-right: 35px;
    }

    .es-p40 {
      padding: 40px;
    }

    .es-p40t {
      padding-top: 40px;
    }

    .es-p40b {
      padding-bottom: 40px;
    }

    .es-p40l {
      padding-left: 40px;
    }

    .es-p40r {
      padding-right: 40px;
    }

    .es-menu td {
      border: 0;
    }

    a {
      text-decoration: underline;
    }

    p,
    ul li,
    ol li {
      font-family: lato, "helvetica neue", helvetica, arial, sans-serif;
      line-height: 150%;
    }

    ul li,
    ol li {
      Margin-bottom: 15px;
      margin-left: 0;
    }

    .es-menu td a {
      text-decoration: none;
      display: block;
      font-family: lato, "helvetica neue", helvetica, arial, sans-serif;
    }

    .es-menu amp-img,
    .es-button amp-img {
      vertical-align: middle;
    }

    .es-wrapper {
      width: 100%;
      height: 100%;
    }

    .es-wrapper-color,
    .es-wrapper {
      background-color: #F4F4F4;
    }

    .es-header {
      background-color: #EC6D64;
    }

    .es-header-body {
      background-color: #EC6D64;
    }

    .es-header-body p,
    .es-header-body ul li,
    .es-header-body ol li {
      color: #666666;
      font-size: 14px;
    }

    .es-header-body a {
      color: #111111;
      font-size: 14px;
    }

    .es-content-body {
      background-color: #FFFFFF;
    }

    .es-content-body p,
    .es-content-body ul li,
    .es-content-body ol li {
      color: #666666;
      font-size: 18px;
    }

    .es-content-body a {
      color: #EC6D64;
      font-size: 18px;
    }

    .es-footer {
      background-color: transparent;
    }

    .es-footer-body {
      background-color: transparent;
    }

    .es-footer-body p,
    .es-footer-body ul li,
    .es-footer-body ol li {
      color: #666666;
      font-size: 14px;
    }

    .es-footer-body a {
      color: #111111;
      font-size: 14px;
    }

    .es-infoblock,
    .es-infoblock p,
    .es-infoblock ul li,
    .es-infoblock ol li {
      line-height: 120%;
      font-size: 12px;
      color: #CCCCCC;
    }

    .es-infoblock a {
      font-size: 12px;
      color: #CCCCCC;
    }

    h1 {
      font-size: 48px;
      font-style: normal;
      font-weight: normal;
      color: #111111;
    }

    h2 {
      font-size: 24px;
      font-style: normal;
      font-weight: normal;
      color: #111111;
    }

    h3 {
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      color: #111111;
    }

    .es-header-body h1 a,
    .es-content-body h1 a,
    .es-footer-body h1 a {
      font-size: 48px;
    }

    .es-header-body h2 a,
    .es-content-body h2 a,
    .es-footer-body h2 a {
      font-size: 24px;
    }

    .es-header-body h3 a,
    .es-content-body h3 a,
    .es-footer-body h3 a {
      font-size: 20px;
    }

    a.es-button,
    button.es-button {
      border-style: solid;
      border-color: #EC6D64;
      border-width: 15px 25px 15px 25px;
      display: inline-block;
      background: #EC6D64;
      border-radius: 2px;
      font-size: 20px;
      font-family: helvetica, "helvetica neue", arial, verdana, sans-serif;
      font-weight: normal;
      font-style: normal;
      line-height: 120%;
      color: #FFFFFF;
      text-decoration: none;
      width: auto;
      text-align: center;
    }

    .es-button-border {
      border-style: solid solid solid solid;
      border-color: #EC6D64 #EC6D64 #EC6D64 #EC6D64;
      background: #EC6D64;
      border-width: 1px 1px 1px 1px;
      display: inline-block;
      border-radius: 2px;
      width: auto;
    }

    .es-p-default {
      padding-top: 20px;
      padding-right: 30px;
      padding-bottom: 0px;
      padding-left: 30px;
    }

    .es-p-all-default {
      padding: 0px;
    }

    @media only screen and (max-width:600px) {

      p,
      ul li,
      ol li,
      a {
        line-height: 150%
      }

      h1,
      h2,
      h3,
      h1 a,
      h2 a,
      h3 a {
        line-height: 120%
      }

      h1 {
        font-size: 30px;
        text-align: center
      }

      h2 {
        font-size: 26px;
        text-align: center
      }

      h3 {
        font-size: 20px;
        text-align: center
      }

      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 30px
      }

      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 26px
      }

      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 20px
      }

      .es-menu td a {
        font-size: 16px
      }

      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li,
      .es-header-body a {
        font-size: 16px
      }

      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li,
      .es-content-body a {
        font-size: 16px
      }

      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li,
      .es-footer-body a {
        font-size: 16px
      }

      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li,
      .es-infoblock a {
        font-size: 12px
      }

      *[class="gmail-fix"] {
        display: none
      }

      .es-m-txt-c,
      .es-m-txt-c h1,
      .es-m-txt-c h2,
      .es-m-txt-c h3 {
        text-align: center
      }

      .es-m-txt-r,
      .es-m-txt-r h1,
      .es-m-txt-r h2,
      .es-m-txt-r h3 {
        text-align: right
      }

      .es-m-txt-l,
      .es-m-txt-l h1,
      .es-m-txt-l h2,
      .es-m-txt-l h3 {
        text-align: left
      }

      .es-m-txt-r amp-img {
        float: right
      }

      .es-m-txt-c amp-img {
        margin: 0 auto
      }

      .es-m-txt-l amp-img {
        float: left
      }

      .es-button-border {
        display: block
      }

      a.es-button,
      button.es-button {
        font-size: 20px;
        display: block;
        border-width: 15px 25px 15px 25px
      }

      .es-btn-fw {
        border-width: 10px 0px;
        text-align: center
      }

      .es-adaptive table,
      .es-btn-fw,
      .es-btn-fw-brdr,
      .es-left,
      .es-right {
        width: 100%
      }

      .es-content table,
      .es-header table,
      .es-footer table,
      .es-content,
      .es-footer,
      .es-header {
        width: 100%;
        max-width: 600px
      }

      .es-adapt-td {
        display: block;
        width: 100%
      }

      .adapt-img {
        width: 100%;
        height: auto
      }

      td.es-m-p0 {
        padding: 0px
      }

      td.es-m-p0r {
        padding-right: 0px
      }

      td.es-m-p0l {
        padding-left: 0px
      }

      td.es-m-p0t {
        padding-top: 0px
      }

      td.es-m-p0b {
        padding-bottom: 0
      }

      td.es-m-p20b {
        padding-bottom: 20px
      }

      .es-mobile-hidden,
      .es-hidden {
        display: none
      }

      tr.es-desk-hidden,
      td.es-desk-hidden,
      table.es-desk-hidden {
        width: auto;
        overflow: visible;
        float: none;
        max-height: inherit;
        line-height: inherit
      }

      tr.es-desk-hidden {
        display: table-row
      }

      table.es-desk-hidden {
        display: table
      }

      td.es-desk-menu-hidden {
        display: table-cell
      }

      .es-menu td {
        width: 1%
      }

      table.es-table-not-adapt,
      .esd-block-html table {
        width: auto
      }

      table.es-social {
        display: inline-block
      }

      table.es-social td {
        display: inline-block
      }

      .es-desk-hidden {
        display: table-row;
        width: auto;
        overflow: visible;
        max-height: inherit
      }
    }
  </style>
</head>

<body>
  <div class="es-wrapper-color">
    <!--[if gte mso 9]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t"> <v:fill type="tile" color="#f4f4f4"></v:fill> </v:background><![endif]-->
    <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
      <tr class="gmail-fix" height="0">
        <td>
          <table width="600" cellspacing="0" cellpadding="0" border="0" align="center">
            <tr>
              <td style="line-height: 1px;min-width: 600px" height="0"><amp-img
                  src="https://firebasestorage.googleapis.com/v0/b/workspace-5ae05.appspot.com/o/stirlogos%2Fstirs-logo.png?alt=media&token=75b34c47-2a98-4e0d-9076-450e0c0fa554"
                  style="display: block;max-height: 0px;min-height: 0px;min-width: 600px;width: 600px" alt width="600"
                  height="1"></amp-img></td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td valign="top">
          <table cellpadding="0" cellspacing="0" class="es-content" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0"
                  cellpadding="0" align="center">
                  <tr>
                    <td class="es-p15t es-p15b es-p10r es-p10l" align="left">
                      <!--[if mso]><table width="580" cellpadding="0" cellspacing="0"><tr><td width="282" valign="top"><![endif]-->
                      <table class="es-left" cellspacing="0" cellpadding="0" align="left">
                        <tr>
                          <td width="282" align="left">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-infoblock es-m-txt-c" align="left">
                                  <p style="font-family: arial, helvetica\ neue, helvetica, sans-serif">Welcome to The
                                    StirHub<br></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table> <!--[if mso]></td><td width="20"></td>
<td width="278" valign="top"><![endif]-->
                      <table class="es-right" cellspacing="0" cellpadding="0" align="right">
                        <tr>
                          <td width="278" align="left">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td align="right" class="es-infoblock es-m-txt-c">
                                  <p><a href="https://stirhub.app" class="view" target="_blank"
                                      style="font-family: 'arial', 'helvetica neue', 'helvetica', 'sans-serif'">View in
                                      browser</a></p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table> <!--[if mso]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-header" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center" bgcolor="#008080" style="background-color: #008080">
                <table class="es-header-body" width="600" cellspacing="0" cellpadding="0" align="center"
                  bgcolor="#008080" style="background-color: #008080">
                  <tr>
                    <td class="es-p20t es-p10b es-p10r es-p10l" align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="580" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-p25t es-p25b es-p10r es-p10l" align="center" style="font-size: 0px">
                                  <amp-img
                                    src="https://firebasestorage.googleapis.com/v0/b/workspace-5ae05.appspot.com/o/stirlogos%2Fstirs-logo.png?alt=media&token=75b34c47-2a98-4e0d-9076-450e0c0fa554"
                                    alt style="display: block" width="40" height="40"></amp-img>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td style="background-color: #008080" bgcolor="#008080" align="center">
                <table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0"
                  cellpadding="0" align="center">
                  <tr>
                    <td align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table style="background-color: #ffffff;border-radius: 4px;border-collapse: separate"
                              width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
                              <tr>
                                <td class="es-p35t es-p5b es-p30r es-p30l" align="center">
                                  <h1>Hurray! You got Invited.</h1>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p5t es-p5b es-p20r es-p20l" bgcolor="#ffffff" align="center"
                                  style="font-size:0">
                                  <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                    <tr>
                                      <td
                                        style="border-bottom: 1px solid #ffffff;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height: 1px;width: 100%;margin: 0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" style="background-color: #ffffff" width="600" cellspacing="0"
                  cellpadding="0" bgcolor="#ffffff" align="center">
                  <tr>
                    <td align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table style="background-color: #ffffff" width="100%" cellspacing="0" cellpadding="0"
                              bgcolor="#ffffff" role="presentation">
                              <tr>
                                <td class="es-m-txt-l es-p20t es-p15b es-p30r es-p30l" bgcolor="#ffffff" align="left">
                                  <p>Hi, you have been invited by ${this.profile.name ? this.profile.name : this.profile.firstname + ' ' + this.profile.lastname} to join The StirHub. A social and
                                    engagement platform for Science, Technology, Innovation and Research professionals
                                    and enthusiasts.<br><br>Click the button below to sign up.</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                  <tr>
                    <td class="es-p20b es-p30r es-p30l" align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="540" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-p40t es-p40b es-p10r es-p10l" align="center">
                                  <!--[if mso]><a href="https://stirhub.app/" target="_blank" hidden> <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" esdevVmlButton href="https://stirhub.app/" style="height:54px; v-text-anchor:middle; width:122px" arcsize="4%" stroke="f" fillcolor="#008080"> <w:anchorlock></w:anchorlock> <center style='color:#ffffff; font-family:helvetica, "helvetica neue", arial, verdana, sans-serif; font-size:20px; font-weight:400; line-height:20px; mso-text-raise:1px'>Sign Up</center> </v:roundrect></a><![endif]-->
                                  <!--[if !mso]><!-- --><span class="msohide es-button-border"
                                    style="border-color: #008080;border-width: 0px;background: #008080"><a
                                      href="https://stirhub.app/signup/${inviteId}"
                                      class="es-button es-button-1" target="_blank"
                                      style="border-width: 15px 25px;background: #008080;border-color: #008080">Sign
                                      Up</a></span> <!--<![endif]-->
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" width="600" cellspacing="0" cellpadding="0" bgcolor="#ffffff"
                  align="center">
                  <tr>
                    <td align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table style="border-radius: 4px;border-collapse: separate;background-color: #111111"
                              width="100%" cellspacing="0" cellpadding="0" bgcolor="#111111" role="presentation">
                              <tr>
                                <td class="es-m-txt-l es-p35t es-p30r es-p30l" bgcolor="#111111" align="left">
                                  <h2 style="color: #ffffff">One Superaccount for all.</h2>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p20t es-p30r es-p30l es-m-txt-l" align="left">
                                  <p>By signing up you will have access to other related platforms and services. Just
                                    stay tuned.</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p20t es-p40b es-p30r es-p30l" align="left"><a target="_blank"
                                    href="https://stirhub.app/about">Learn more about StirHub</a>tir</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0"
                  cellpadding="0" align="center">
                  <tr>
                    <td align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-p10t es-p20b es-p20r es-p20l" align="center" style="font-size:0">
                                  <table width="100%" cellspacing="0" cellpadding="0" border="0" role="presentation">
                                    <tr>
                                      <td
                                        style="border-bottom: 1px solid #f4f4f4;background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;height: 1px;width: 100%;margin: 0px">
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" style="background-color: #f6edc9" width="600" cellspacing="0"
                  cellpadding="0" align="center" bgcolor="#f6edc9">
                  <tr>
                    <td align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="600" valign="top" align="center">
                            <table style="border-radius: 4px;border-collapse: separate" width="100%" cellspacing="0"
                              cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-p30t es-p30r es-p30l" align="center">
                                  <h3 style="color: #111111">Need more info?</h3>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p30b es-p30r es-p30l" align="center"><a target="_blank"
                                    href="mailto:engage@stirhub.app">We’re here, ready to talk</a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table cellpadding="0" cellspacing="0" class="es-footer" align="center">
            <tr>
              <td align="center">
                <table class="es-footer-body" width="600" cellspacing="0" cellpadding="0" align="center">
                  <tr>
                    <td class="es-p30t es-p30b es-p30r es-p30l" align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="540" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td align="left" class="es-p25t">
                                  <p>You received this email because you just signed up for a new account. If it looks
                                    weird, <strong><a class="view" target="_blank" href="https://stirhub.app">view
                                        it in your browser</a></strong>.</p>
                                </td>
                              </tr>
                              <tr>
                                <td class="es-p25t" align="left">
                                  <p>StirHub -&nbsp;Copyright @&nbsp;2023</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <table class="es-content" cellspacing="0" cellpadding="0" align="center">
            <tr>
              <td align="center">
                <table class="es-content-body" style="background-color: transparent" width="600" cellspacing="0"
                  cellpadding="0" align="center">
                  <tr>
                    <td class="es-p30t es-p30b es-p20r es-p20l" align="left">
                      <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                          <td width="560" valign="top" align="center">
                            <table width="100%" cellspacing="0" cellpadding="0" role="presentation">
                              <tr>
                                <td class="es-infoblock made_with" align="center" style="font-size: 0px"><a
                                    target="_blank" href="https://stirhub.app/"><amp-img
                                      src="https://firebasestorage.googleapis.com/v0/b/workspace-5ae05.appspot.com/o/stirlogos%2Flogo-m.png?alt=media&token=a469038f-44de-4354-925a-4a8b52bd44f7"
                                      alt width="125" style="display: block" height="36"></amp-img></a></td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </div>
</body>

</html>

    `;
    this.generalService.addItem('emails', invitation);
    const toast = await this.toastCtrl.create({
      message: `You have sent another invitation to ${email}`,
      duration: 2000
    });
    toast.present();
    loading.dismiss();
  }

}
